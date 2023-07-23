import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link, Skeleton, Stack, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material"

import Table from "./Table";
import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import ErrorContext from "../contexts/ErrorContext";
import Project from "../schemas/Project";
import UserAvatar from "./UserAvatar";

export default function ProjectTable() {
    const locale = React.useContext(LocaleContext);
    const { projectService } = React.useContext(ServiceContext);
    const { setError } = React.useContext(ErrorContext);
    return (<Table<Project>
        caption={locale.schemas.project.plural}
        columns={[
            {
                label: locale.schemas.project.properties.name,
                map: (value, property, object) =>
                    <Link component={RouterLink} to={"project/".concat(object.id!.toString())}>
                        {value}
                    </Link>,
                path: "name",
                skeleton: <Skeleton height={20} variant="rounded" />,
                width: "20%"
            },
            {
                label: locale.schemas.project.properties.description,
                path: "description",
                skeleton: <Skeleton height={20} variant="rounded" />,
                width: "50%"
            },
            {
                label: locale.schemas.project.properties.leader,
                map: (value, property, object) =>
                    <Stack direction="row">
                        <UserAvatar user={object.leader} sx={{ fontSize: 12, height: 24, marginRight: 1, width: 24 }} />
                        <Typography>{value}</Typography>
                    </Stack>,
                path: "leader.name",
                skeleton:
                    <Stack direction="row">
                        <Skeleton height={24} sx={{ marginRight: 1 }} variant="circular" width={24} />
                        <Skeleton height={20} variant="rounded" width="70%" />
                    </Stack>,
                width: "30%"
            },
        ]}
        onError={setError}
        onDelete={selection => projectService.deleteAll(...selection)}
        onRetrieve={pagination => projectService.retrieveAll(pagination)}
        tools={< Button sx={{ whiteSpace: "nowrap" }} variant="contained" > {locale.actions.create} {locale.schemas.project.singular}</Button >}
    />)
}