import React from "react";

interface State {

}

export const defaultState: State = {

};

type Action =
	{ type: "", payload: any }
	;

export function reducer(state: State, action: Action): State {
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
	const initialState: State = {
		...defaultState,

	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<Context.Provider value={{ state, dispatch }}>

		</Context.Provider>
	);
}

export type TemplateContextValue = ContextValue;
export type TemplateProperties = Properties;

export const Template = Component;
export const TemplateContext = Context;

export default Template;
