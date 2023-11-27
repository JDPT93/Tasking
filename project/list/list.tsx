import React from "react";

import {
	List as MuiList,
	Paper as MuiPaper,
	Typography
} from "@mui/material";

import GoalListItem from "component/project/goal/list/item";

import Project from "model/project/project";
import Page, { defaultPage } from "model/common/page";
import Pagination, { defaultPagination } from "model/common/pagination";
import Goal from "model/project/goal/goal";

import goalService from "service/project/goal/goal-service";

interface State {
	readonly page: Page<Goal>;
	readonly pagination: Pagination;
	readonly ready: boolean;
}

export const defaultState: State = {
	page: defaultPage,
	pagination: defaultPagination,
	ready: false
};

type Action =
	{ type: "page.load", payload: Page<Goal> } |
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
	onError?: (error: Error) => void
};

function Component({
	project,
	onError
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	if (project === undefined) {
		return <></>// LOADING
	}
	React.useEffect(() => {
		if (!state.ready) {
			goalService.retrieveByProjectId(project.id, state.pagination)
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Goal> = body;
					dispatch({ type: "page.load", payload: page });
				})
				.catch((error: Error) => {
					onError?.(error);
				});
		}
	}, [state.ready]);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiPaper>
				<Typography variant="h4">Objetivos</Typography>
				<MuiList>
					{state.page.content.map((goal: Goal) => (
						<GoalListItem key={goal.id} value={goal} />
					))}
				</MuiList>
			</MuiPaper>
		</Context.Provider>
	);
}

export type GoalListContextValue = ContextValue;
export type GoalListProperties = Properties;

export const GoalList = Component;
export const GoalListContext = Context;

export default GoalList;
