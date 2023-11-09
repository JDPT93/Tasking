import React from "react";

import {
	Box as MuiBox
} from "@mui/material";

interface State {

}

const initialState: State = {

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

type Properties = {

};

function Component({

}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<MuiBox>

		</MuiBox>
	);
}

export type NavigationState = State;
export type NavigationAction = Action;
export type NavigationContextValue = ContextValue;
export type NavigationProperties = Properties;
export const Navigation = Object.assign(Component, {
	initialState,
	reducer
});

export default Navigation;
