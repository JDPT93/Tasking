import React from "react";

import {
	ListItemText,
	ListItem as MuiListItem
} from "@mui/material";
import Goal from "model/project/goal/goal";

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
	value: Goal
};

function Component({
	value
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiListItem>
				<ListItemText primary={value.name} />
			</MuiListItem>
		</Context.Provider>
	);
}

export type GoalListItemContextValue = ContextValue;
export type GoalListItemProperties = Properties;

export const GoalListItem = Component;
export const GoalListItemContext = Context;

export default GoalListItem;
