import React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Box, Card, Link, Typography, Divider, Stack, ImageList, ImageListItem, CardActionArea, Breadcrumbs, Paper, Avatar } from "@mui/material";
import { DashboardOutlined as DashboardOutlinedIcon, FolderOutlined as FolderOutlinedIcon, InsertDriveFileOutlined as InsertDriveFileOutlinedIcon } from "@mui/icons-material";

import IssueCard from "./IssueCard";
import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import Project from "../schemas/Project";

function ProjectBoard() {
    const { id } = useParams();
    const [project, setProject] = React.useState<Project | null>(null);
    const locale = React.useContext(LocaleContext);
    const { projectService } = React.useContext(ServiceContext);
    React.useEffect(() => {
        projectService.retrieveById(+id!)
            .then(async response => {
                const body = await response.json();
                if (!response.ok) {
                    throw body as Error;
                }
                setProject(body as Project);
            })
            .catch(error => {

            });
    }, []);
    return (
        <Box padding={3}>
            <Breadcrumbs>
                <Link
                    alignItems="center"
                    color="inherit"
                    component={RouterLink}
                    display="flex"
                    to="/"
                    underline="hover"
                >
                    <FolderOutlinedIcon sx={{ mr: 0.5 }} />
                    {locale.schemas.project.plural}
                </Link>
                <Link
                    alignItems="center"
                    color="inherit"
                    component={RouterLink}
                    display="flex"
                    to={`/project/${project?.id}`}
                    underline="hover"
                >
                    <InsertDriveFileOutlinedIcon sx={{ mr: 0.5 }} />
                    {project?.name}
                </Link>
                <Typography
                    color="text.primary"
                    display="flex"
                    alignItems="center"
                >
                    <DashboardOutlinedIcon sx={{ mr: 0.5 }} />
                    {locale.components.projectBoard.name}
                </Typography>
            </Breadcrumbs>
            {project
                ? <ImageList gap={12} sx={{
                    gridAutoFlow: "column",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr)) !important",
                    gridAutoColumns: "minmax(300px, 1fr)",
                    minHeight: "100vh",
                    padding: 2
                }}>
                    {project!.stages!.sort((left, right) => left.position - right.position).map(stage =>
                        <ImageListItem>
                            <Paper elevation={2} key={stage.id} sx={{ height: "100%" }}>
                                <Typography fontWeight={500} padding={2} textTransform="uppercase" variant="body2">{stage.name}</Typography>
                                <Divider />
                                <Stack gap={1} padding={2}>
                                    {stage.issues?.map(issue => <IssueCard issue={issue} />)}
                                </Stack>
                            </Paper>
                        </ImageListItem>
                    )}
                </ImageList>
                : null
            }
        </Box >
    )
}

export default ProjectBoard;
