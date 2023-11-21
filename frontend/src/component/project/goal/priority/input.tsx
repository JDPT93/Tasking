import React from "react";

import {
	Autocomplete as MuiAutocomplete,
	TextField as MuiTextField
} from "@mui/material";

import Changelog from "model/common/changelog";
import Page, { defaultPage } from "model/common/page";
import Priority from "model/project/goal/priority";

import priorityService from "service/project/goal/priority-service";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly page: Page<Priority>;
	readonly ready: Boolean;
	readonly value: Priority | null

}

const defaultState: State = {
	page: defaultPage,
	ready: false,
	value: null
};

type Action =
	{ type: "page.load", payload: Page<Priority> } |
	{ type: "page.reload" }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "page.load": {
			return {
				...state,
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
	value?: Priority,
	onError?: (error: Error) => void,
	onDelete?: (value: Priority) => void,
	onRetrieve?: (page: Page<Priority>) => void
	onUpdate?: (page: Changelog<Priority>) => void
};

function Component({
	value,
	onError,
	onDelete,
	onRetrieve,
	onUpdate
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	React.useEffect(() => {
		if (!state.ready) {
			priorityService.retrieveAll({ sort: { "name": "asc" } })
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Priority> = body;
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
			<MuiAutocomplete
				options={state.page.content}
				getOptionLabel={(option) => option.name}
				renderInput={(params) => <MuiTextField {...params} label="Prioridad" />}
			/>
		</Context.Provider>
	);
}

export type PriorityInputSetup = Setup;
export type PriorityInputState = State;
export type PriorityInputAction = Action;
export type PriorityInputContextValue = ContextValue;
export type PriorityInputProperties = Properties;
export const PriorityInput = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default PriorityInput;