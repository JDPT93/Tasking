import React from "react";

import {
	Droppable as RbdDroppable,
	DroppableProps as RbdDroppableProps
} from "react-beautiful-dnd";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly active: boolean;
}

const defaultState: State = {
	active: false
};

type Action =
	{ type: "disable" } |
	{ type: "enable" }
	;

function reducer(state: State, action: Action): State {
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
	return state.active
		? (
			<Context.Provider value={{ state, dispatch }}>
				<RbdDroppable {...properties}>
					{children}
				</RbdDroppable>
			</Context.Provider>
		)
		: null;
}

export type DroppableSetup = Setup;
export type DroppableState = State;
export type DroppableAction = Action;
export type DroppableContextValue = ContextValue;
export type DroppableProperties = Properties;
export const Droppable = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default Droppable;

