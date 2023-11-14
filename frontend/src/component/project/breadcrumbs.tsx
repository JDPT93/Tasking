import React from "react";

import {
	Link
} from "react-router-dom";


import {
	DashboardOutlined as DashboardOutlinedIcon,
	FolderOutlined as FolderOutlinedIcon,
	InsertDriveFileOutlined as InsertDriveFileOutlinedIcon
} from "@mui/icons-material";

import {
	Breadcrumbs as MuiBreadcrumbs,
	Link as MuiLink,
	Typography as MuiTypography
} from "@mui/material";

import Main, { MainContextValue } from "component/main";

import Project from "model/project/project";

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
	value: Project
};

function Component({
	value
}: Properties) {
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/page/breadcrumbs.json`);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiBreadcrumbs sx={{ margin: 2 }}>
				<MuiLink
					alignItems="center"
					color="inherit"
					component={Link}
					display="flex"
					to="/project"
					underline="hover">
					<FolderOutlinedIcon sx={{ mr: 0.5 }} />
					{locale.links.projects}
				</MuiLink>
				<MuiLink
					alignItems="center"
					color="inherit"
					component={Link}
					display="flex"
					to={`/project/${value.id}`}
					underline="hover">
					<InsertDriveFileOutlinedIcon sx={{ mr: 0.5 }} />
					{value?.name}
				</MuiLink>
				<MuiTypography
					color="text.primary"
					display="flex"
					alignItems="center">
					<DashboardOutlinedIcon sx={{ mr: 0.5 }} />
					{locale.links.board}
				</MuiTypography>
			</MuiBreadcrumbs>
		</Context.Provider>
	);
}

export type ProjectBreadcrumbsSetup = Setup;
export type ProjectBreadcrumbsState = State;
export type ProjectBreadcrumbsAction = Action;
export type ProjectBreadcrumbsContextValue = ContextValue;
export type ProjectBreadcrumbsProperties = Properties;
export const ProjectBreadcrumbs = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectBreadcrumbs;
