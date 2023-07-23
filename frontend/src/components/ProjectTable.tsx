import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material"

import GenericTable from "./Table";
import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import ErrorContext from "../contexts/ErrorContext";
import Project from "../schemas/Project";

export default function ProjectTable() {
    const locale = React.useContext(LocaleContext);
    const { projectService } = React.useContext(ServiceContext);
    const { setError } = React.useContext(ErrorContext);
    return (<GenericTable<Project>
        caption={locale.schemas.project.plural}
        columns={[
            {
                label: locale.schemas.project.properties.name,
                map: (value, property, object) => <Link component={RouterLink} to={"project/".concat(object.id!.toString())}>{value}</Link>,
                path: "name",
                width: "30%"
            },
            { label: locale.schemas.project.properties.description, path: "description", width: "40%" },
            { label: locale.schemas.project.properties.leader, path: "leader.name", width: "30%" },
        ]}
        onError={setError}
        onDelete={selection => projectService.deleteAll(...selection)}
        onRetrieve={pagination => projectService.retrieveAll(pagination)}
        tools={<Button sx={{ whiteSpace: "nowrap" }} variant="contained">{locale.actions.create} {locale.schemas.project.singular}</Button>}
    />)
}