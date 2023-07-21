import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material"

import GenericTable from "./GenericTable";
import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import ErrorContext from "../contexts/ErrorContext";
import ProjectContext from "../contexts/ProjectContext";
import Project from "../schemas/Project";

export default function ProjectTable() {
    const locale = React.useContext(LocaleContext);
    const { projectService } = React.useContext(ServiceContext);
    const { setProject } = React.useContext(ProjectContext);
    const { setError } = React.useContext(ErrorContext);
    return (<GenericTable<Project>
        caption={locale.schemas.project.plural}
        columns={[
            {
                property: "name",
                label: locale.schemas.project.properties.name,
                map: (value, property, object) => <Link component={RouterLink} onClick={() => setProject(object)} to={"project/".concat(object.id!.toString())}>{value}</Link>
            },
            { property: "description", label: locale.schemas.project.properties.description, },
            { property: "leader.fullname", label: locale.schemas.project.properties.leader },
        ]}
        onError={setError}
        onDelete={selection => projectService.deleteAll(...selection)}
        onRetrieve={pagination => projectService.findAll(pagination)}
        tools={<Button startIcon={<AddIcon />} variant="contained">{locale.actions.create}</Button>}
    />)
}