import React from "react";

import {
	Add as AddIcon
} from "@mui/icons-material";

import {
	Button as MuiButton
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";
import ProjectDialog from "component/project/dialog";
import ProjectTable from "component/project/table/table";

import Changelog from "model/common/changelog";
import Page from "model/common/page";
import Project from "model/project/project";

interface State {
	readonly create: boolean;
}

export const defaultState: State = {
	create: false
};

type Action =
	{ type: "create.toggle" }
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
	onCreate?: (value: Project) => void,
	onDelete?: (value: Project) => void,
	onError?: (error: Error) => void,
	onRetrieve?: (page: Page<Project>) => void,
	onUpdate?: (changelog: Changelog<Project>) => void,
};

function Component({
	onCreate,
	onDelete,
	onError,
	onRetrieve,
	onUpdate
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/manager.json`);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<ProjectTable
				onDelete={onDelete}
				onError={onError}
				onRetrieve={onRetrieve}
				onUpdate={onUpdate}
				secondaryAction={
					<MuiButton
						startIcon={<AddIcon />}
						variant="contained"
						onClick={() => dispatch({ type: "create.toggle" })}
					>
						{locale.actions.create}
					</MuiButton>
				}
			/>
			<ProjectDialog
				open={state.create}
				variant="create"
				onCancel={() => dispatch({ type: "create.toggle" })}
				onError={onError}
				onSuccess={onCreate}
			/>
		</Context.Provider>
	);
}

export type ProjectManagerContextValue = ContextValue;
export type ProjectManagerProperties = Properties;

export const ProjectManager = Component;
export const ProjectManagerContext = Context;

export default ProjectManager;
