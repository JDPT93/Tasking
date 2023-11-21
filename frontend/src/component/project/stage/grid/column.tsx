import React from "react";

import {
	Divider as MuiDivider,
	Paper as MuiPaper,
	Stack as MuiStack,
	Typography as MuiTypography
} from "@mui/material";

import IssueCard from "component/project/goal/issue/card";

import Page, { defaultPage } from "model/common/page";
import Issue from "model/project/goal/issue";
import Stage from "model/project/stage/stage";

import issueService from "service/project/goal/issue-service";
import { DroppableProvided } from "react-beautiful-dnd";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly page: Page<Issue>;
	readonly ready: boolean;
}

const defaultState: State = {
	page: defaultPage,
	ready: false
};

type Action =
	{ type: "page.load", payload: Page<Issue> } |
	{ type: "page.reload" }
	;

function reducer(state: State, action: Action): State {
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
	}
}

interface ContextValue {
	readonly state: State;
	readonly dispatch?: (action: Action) => void;
}

const Context = React.createContext<ContextValue>({ state: defaultState });

type Properties = {
	value: Stage,
	provided: DroppableProvided,
	onError?: (error: Error) => void,
	onRetrieve?: (page: Page<Issue>) => void
};

function Component({
	value,
	provided,
	onError,
	onRetrieve
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	React.useEffect(() => {
		if (!state.ready) {
			issueService.retrieveByStageId(value.id, { sort: { "index": "asc" } })
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Issue> = body;
					dispatch({ type: "page.load", payload: page });
					onRetrieve?.(page);
				})
				.catch((error: Error) => {
					onError?.(error);
				});
		}
	}, [state.ready]);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiPaper elevation={2} sx={{ height: "100%" }}>
				<MuiTypography fontWeight={500} padding={2} textTransform="uppercase" variant="body2">
					{value.name}
				</MuiTypography>
				<MuiDivider />
				<MuiStack padding={2} ref={provided.innerRef} {...provided.droppableProps} >
					{state.page.content.map((issue: Issue) => (
						<IssueCard value={issue} key={issue.id.toString()} />
					))}
					{provided.placeholder}
				</MuiStack>
			</MuiPaper>
		</Context.Provider>
	);
}

export type IssueGridColumnSetup = Setup;
export type IssueGridColumnState = State;
export type IssueGridColumnAction = Action;
export type IssueGridColumnContextValue = ContextValue;
export type IssueGridColumnProperties = Properties;
export const IssueGridColumn = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default IssueGridColumn;
