import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Avatar, Badge, Box, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { Mail as MailIcon, Menu as MenuIcon, Notifications as NotificationsIcon } from "@mui/icons-material";

import GenericTable from "./GenericTable";
import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import UserContext from "../contexts/UserContext";
import ProjectContext from "../contexts/ProjectContext";
import Project from "../schemas/Project";

export default function Main() {
    const locale = React.useContext(LocaleContext);
    const { user } = React.useContext(UserContext);
    const { projectService } = React.useContext(ServiceContext);
    const [project, setProject] = React.useState<Project | null>(null);
    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" noWrap>{locale.application.name}</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <IconButton color="inherit" size="large">
                                <Badge badgeContent={0} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit" size="large">
                                <Badge badgeContent={3} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit" size="small">
                                <Avatar alt={user?.name} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <GenericTable
                    caption={locale.schemas.project.plural}
                    columns={[
                        {
                            property: "name",
                            label: locale.schemas.project.properties.name,
                            map: (value, property, object) =>
                                <Link component={RouterLink} to={"project/".concat(object.id.toString())}>{object.name}</Link>
                        },
                        { property: "description", label: locale.schemas.project.properties.description, },
                        { property: "leader.name", label: locale.schemas.project.properties.leader + " (" + locale.schemas.user.properties.name + ")" },
                        { property: "leader.surname", label: locale.schemas.project.properties.leader + " (" + locale.schemas.user.properties.surname + ")" }
                    ]}
                    service={projectService}
                />
            </Box >
        </ProjectContext.Provider>
    );
}