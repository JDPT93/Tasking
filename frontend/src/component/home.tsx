import React from "react";

import {
	Stack as MuiStack
} from "@mui/material";

import CollaborationTable from "component/project/collaboration/table/table";
import ProjectManager from "component/project/manager";

interface Setup {

}

const setup: Setup = {

};

interface State {

}

const defaultState: State = {

};

type Action =
	{ type: "", payload: any }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "": {
			return {
				...state,

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

};

function Component({

}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiStack padding={2} spacing={2}>
				<ProjectManager />
				<CollaborationTable />
			</MuiStack>
		</Context.Provider>
	);
}

export type HomeSetup = Setup;
export type HomeState = State;
export type HomeAction = Action;
export type HomeContextValue = ContextValue;
export type HomeProperties = Properties;
export const Home = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default Home;
