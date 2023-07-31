import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import { DashboardOutlined as DashboardOutlinedIcon, FolderOutlined as FolderOutlinedIcon, InsertDriveFileOutlined as InsertDriveFileOutlinedIcon } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";

import LocaleContext from "../contexts/LocaleContext";

import Project from "../schemas/Project";

interface Properties {
  project: Project;
}

export default function NavigationBar({ project }: Properties) {
  const locale = React.useContext(LocaleContext);
  return (
    <Breadcrumbs sx={{ margin: 2 }}>
      <Link
        alignItems="center"
        color="inherit"
        component={RouterLink}
        display="flex"
        to="/"
        underline="hover">
        <FolderOutlinedIcon sx={{ mr: 0.5 }} />
        {locale.schemas.project.plural}
      </Link>
      <Link
        alignItems="center"
        color="inherit"
        component={RouterLink}
        display="flex"
        to={`/project/${project?.id}`}
        underline="hover">
        <InsertDriveFileOutlinedIcon sx={{ mr: 0.5 }} />
        {project.name}
      </Link>
      <Typography
        color="text.primary"
        display="flex"
        alignItems="center">
        <DashboardOutlinedIcon sx={{ mr: 0.5 }} />
        {locale.components.projectBoard.name}
      </Typography>
    </Breadcrumbs>
  );
}