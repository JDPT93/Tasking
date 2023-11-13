import React from "react";

import {
	Add as AddIcon
} from "@mui/icons-material";

import {
	Button as MuiButton
} from "@mui/material";

import Main, { MainContextValue } from "component/main";
import ProjectTable from "component/project/table/table";
import ProjectDialog from "component/project/dialog";

import Changelog from "model/common/changelog";
import Page from "model/common/page";
import Project from "model/project/project";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly dialog: boolean;
}

const defaultState: State = {
	dialog: false
};

type Action =
	{ type: "dialog.close" } |
	{ type: "dialog.open" }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "dialog.close": {
			return {
				...state,
				dialog: false
			};
		}
		case "dialog.open": {
			return {
				...state,
				dialog: true
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
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/manager.json`);
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
						onClick={() => dispatch({ type: "dialog.open" })}
					>
						{locale.actions.create}
					</MuiButton>
				}
			/>
			<ProjectDialog
				open={state.dialog}
				variant="create"
				onCancel={() => dispatch({ type: "dialog.close" })}
				onError={onError}
				onSuccess={onCreate}
			/>
		</Context.Provider>
	);
}

export type ProjectManagerSetup = Setup;
export type ProjectManagerState = State;
export type ProjectManagerAction = Action;
export type ProjectManagerContextValue = ContextValue;
export type ProjectManagerProperties = Properties;
export const ProjectManager = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectManager;
