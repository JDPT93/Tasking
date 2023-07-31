import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Link, Skeleton, Typography } from "@mui/material";

import DataGrid from "../components/DataGrid";
import UserAvatar from "../components/UserAvatar";

import ErrorContext from "../contexts/ErrorContext";
import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";

import Project from "../schemas/Project";

export default function ProjectPage() {
  const locale = React.useContext(LocaleContext);
  const { projectService } = React.useContext(ServiceContext);
  const { setError } = React.useContext(ErrorContext);
  return (
    <Box>
      <DataGrid<Project>
        caption={locale.schemas.project.plural}
        columns={[
          {
            label: locale.schemas.project.properties.name,
            map: (value, property, object) => (
              <Link component={RouterLink} to={"/project/".concat(object.id.toString())}>
                {value}
              </Link>
            ),
            path: "name",
            skeleton: (
              <Skeleton height={20} variant="rounded" />
            ),
            width: "20%"
          },
          {
            label: locale.schemas.project.properties.description,
            path: "description",
            skeleton: (
              <Skeleton height={20} variant="rounded" />
            ),
            width: "50%"
          },
          {
            label: locale.schemas.project.properties.leader,
            map: (value, property, object) => (
              <Box display="flex">
                <UserAvatar user={object.leader} sx={{ fontSize: 12, height: 24, marginRight: 1, width: 24 }} />
                <Typography>{value}</Typography>
              </Box>
            ),
            path: "leader.name",
            skeleton: (
              <Box display="flex">
                <Skeleton height={24} sx={{ marginRight: 1 }} variant="circular" width={24} />
                <Skeleton height={20} variant="rounded" width="70%" />
              </Box>
            ),
            width: "30%"
          }
        ]}
        onError={setError}
        onRequestDelete={selection => projectService.deleteAll(...selection)}
        onRequestRetrieve={pagination => projectService.retrieveRelated(pagination)}
        tools={
          <Button sx={{ minWidth: 152, whiteSpace: "nowrap" }} variant="contained" >
            {locale.actions.create} {locale.schemas.project.singular}
          </Button >
        } />
    </Box>
  );
}