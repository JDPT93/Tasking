import React from "react";

import {
	Droppable as RbdDroppable,
	DroppableProps as RbdDroppableProps
} from "react-beautiful-dnd";

interface State {
	readonly active: boolean;
}

export const defaultState: State = {
	active: false
};

type Action =
	{ type: "disable" } |
	{ type: "enable" }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "disable": {
			return {
				...state,
				active: false
			};
		}
		case "enable": {
			return {
				...state,
				active: true
			};
		}
	}
}

interface ContextValue {
	readonly state: State;
	readonly dispatch?: (action: Action) => void;
}

const Context = React.createContext<ContextValue>({ state: defaultState });

type Properties = RbdDroppableProps;

function Component({
	children,
	...properties
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	React.useEffect(() => {
		const animation: number = requestAnimationFrame(() => dispatch({ type: "enable" }));
		return () => {
			cancelAnimationFrame(animation);
			dispatch({ type: "disable" });
		};
	}, []);
	if (!state.active) {
		return null;
	}
	return (
		<Context.Provider value={{ state, dispatch }}>
			<RbdDroppable {...properties}>
				{children}
			</RbdDroppable>
		</Context.Provider>
	);
}

export type DroppableContextValue = ContextValue;
export type DroppableProperties = Properties;

export const Droppable = Component;
export const DroppableContext = Context;

export default Droppable;

