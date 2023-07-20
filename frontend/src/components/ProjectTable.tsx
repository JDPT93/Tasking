import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

import GenericTable from "./GenericTable";
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
                property: "name",
                label: locale.schemas.project.properties.name,
                map: (value, property, object) =>
                    <Link component={RouterLink} to={"project/".concat(object.id!.toString())}>{object.name}</Link>
            },
            { property: "description", label: locale.schemas.project.properties.description, },
            { property: "leader.fullname", label: locale.schemas.project.properties.leader },
        ]}
        onError={setError}
        onRead={pagination => projectService.findAll(pagination)}
    />)
}