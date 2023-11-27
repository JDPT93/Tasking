import React from "react";

import {
	Link
} from "react-router-dom";

import {
	Checklist as ChecklistIcon,
	DashboardOutlined as DashboardOutlinedIcon,
	FolderOutlined as FolderOutlinedIcon,
	InsertDriveFileOutlined as InsertDriveFileOutlinedIcon
} from "@mui/icons-material";

import {
	Breadcrumbs as MuiBreadcrumbs,
	Link as MuiLink,
	Typography as MuiTypography
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";

import Project from "model/project/project";

type Properties = {
	value: Project,
	variant: "backlog" | "board" | "timeline"
};

function Component({
	value,
	variant
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/breadcrumbs.json`);
	return (
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
				{variant === "backlog" && <ChecklistIcon sx={{ mr: 0.5 }} />}
				{variant === "board" && <DashboardOutlinedIcon sx={{ mr: 0.5 }} />}
				{locale.links[variant]}
			</MuiTypography>
		</MuiBreadcrumbs>
	);
}

export type ProjectBreadcrumbsProperties = Properties;

export const ProjectBreadcrumbs = Component;

export default ProjectBreadcrumbs;
