import React from "react";

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

		</Context.Provider>
	);
}

export type ProjectPageSetup = Setup;
export type ProjectPageState = State;
export type ProjectPageAction = Action;
export type ProjectPageContextValue = ContextValue;
export type ProjectPageProperties = Properties;
export const ProjectPage = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectPage;