import * as React from "react";
import { AppBar, Avatar, Badge, Box, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { Mail as MailIcon, Menu as MenuIcon, Notifications as NotificationsIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import UserContext from "../contexts/UserContext";
import ProjectContext from "../contexts/ProjectContext";
import Project from "../schemas/Project";

export default function Main({ children }: React.PropsWithChildren) {
    const locale = React.useContext(LocaleContext);
    const { user } = React.useContext(UserContext);
    const [project, setProject] = React.useState<Project | null>(null);
    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            <Box flexGrow={1}>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" noWrap>{locale.application.name}</Typography>
                        <Box flexGrow={1} />
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
                                <Avatar alt={user?.name} src="#" />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {children}
            </Box >
        </ProjectContext.Provider>
    );
}