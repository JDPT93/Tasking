import React from "react";

import {
	Category as CategoryIcon
} from "@mui/icons-material";

import {
	Divider,
	Stack as MuiStack,
	Typography
} from "@mui/material";

import Page, { defaultPage } from "model/common/page";
import Pagination, { defaultPagination } from "model/common/pagination";
import Iteration from "model/project/iteration";
import Project from "model/project/project";
import Changelog from "model/common/changelog";

import iterationService from "service/project/iteration-service";
import { MainContext, MainContextValue } from "component/main";
import IterationListItem from "../card";

interface State {
	readonly page: Page<Iteration>;
	readonly pagination: Pagination;
	readonly ready: boolean;
}

export const defaultState: State = {
	page: defaultPage,
	pagination: defaultPagination,
	ready: false
};

type Action =
	{ type: "page.load", payload: Page<Iteration> } |
	{ type: "page.reload" } |
	{ type: "pagination.change", payload: Pagination }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "page.load": {
			return {
				...state,
				page: action.payload,
				ready: true
			};
		}
		case "page.reload": {
			return {
				...state,
				ready: false
			};
		}
		case "pagination.change": {
			return {
				...state,
				pagination: action.payload,
				ready: false
			};
		}
	}
}

interface ContextValue {
	readonly state: State;
	readonly dispatch?: (action: Action) => void;
}

const Context = React.createContext<ContextValue>({ state: defaultState });

type Properties = {
	project?: Project,
	onError?: (error: Error) => void,
	onDelete?: (value: Iteration) => void,
	onRetrieve?: (page: Page<Iteration>, pagination: Pagination) => void
	onUpdate?: (page: Changelog<Iteration>) => void
};

function Component({
	project,
	onError,
	onDelete,
	onRetrieve,
	onUpdate
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/iteration/list.json`);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	React.useEffect(() => {
		if (!state.ready && project !== undefined) {
			iterationService.retrieveByProjectId(project.id, state.pagination)
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Iteration> = body;
					dispatch({ type: "page.load", payload: page });
					onRetrieve?.(page, state.pagination);
				})
				.catch((error: Error) => {
					onError?.(error);
				});
		}
	}, [state.ready]);
	if (!state.ready) {
		return (
			<Context.Provider value={{ state, dispatch }}>
				<MuiStack margin={2} spacing={2}>
					{Array.from(Array(5).keys()).map((index: number) => (
						<IterationListItem key={index} />
					))}
				</MuiStack>
			</Context.Provider>
		);
	}
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiStack margin={2} spacing={2}>
				<Typography variant="h5">{locale.title}</Typography>
				<Divider />
				{state.page.content.map((iteration: Iteration) => (
					<IterationListItem
						key={iteration.id}
						value={iteration}
						onDelete={(value: Iteration) => {
							onDelete?.(value);
							setTimeout(() => dispatch({ type: "page.reload" }), 250);
						}}
						onUpdate={(changelog: Changelog<Iteration>) => {
							onUpdate?.(changelog);
							setTimeout(() => dispatch({ type: "page.reload" }), 250);
						}}
					/>
				))}
				{state.page.empty && (
					<>
						<CategoryIcon />
						{locale.messages.empty}
					</>
				)}
			</MuiStack>
		</Context.Provider >
	);
}

export type IterationListContextValue = ContextValue;
export type IterationListProperties = Properties;

export const IterationList = Component;
export const IterationListContext = Context;

export default IterationList;
