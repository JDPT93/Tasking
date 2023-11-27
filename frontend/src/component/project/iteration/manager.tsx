import React from "react";

import IterationList from "component/project/iteration/list/list";

import Changelog from "model/common/changelog";
import Page from "model/common/page";
import Pagination from "model/common/pagination";
import Iteration from "model/project/iteration";
import Project from "model/project/project";

interface State {
	readonly create: boolean;
}

export const defaultState: State = {
	create: false
};

type Action =
	{ type: "create.toggle", payload: any }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "create.toggle": {
			return {
				...state,
				create: !state.create
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
	onCreate?: (value: Iteration) => void,
	onError?: (error: Error) => void,
	onDelete?: (value: Iteration) => void,
	onRetrieve?: (page: Page<Iteration>, pagination: Pagination) => void
	onUpdate?: (page: Changelog<Iteration>) => void
};

function Component({
	project,
	onCreate,
	onError,
	onDelete,
	onRetrieve,
	onUpdate
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<IterationList
				project={project}
				onError={onError}
				onDelete={onDelete}
				onRetrieve={onRetrieve}
				onUpdate={onUpdate}
			/>
		</Context.Provider>
	);
}

export type IterationManagerContextValue = ContextValue;
export type IterationManagerProperties = Properties;

export const IterationManager = Component;
export const IterationManagerContext = Context;

export default IterationManager;
