import * as React from "react";
import { Box, Button, Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, FilterList as FilterListIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import UserContext from "../contexts/UserContext";
import ServiceContext from "../contexts/ServiceContext";
import ErrorContext from "../contexts/ErrorContext";
import Page from "../payloads/Page";
import TableReducer from "../reducers/TableReducer";
import Project from "../schemas/Project";

export default function ProjectTable() {
    const locale = React.useContext(LocaleContext);
    const { projectService } = React.useContext(ServiceContext);
    const { setError } = React.useContext(ErrorContext);
    const { user } = React.useContext(UserContext);
    const [{ pagination, page, selection }, dispatch] = React.useReducer(TableReducer<Project>, {
        pagination: { page: 0, size: 5 },
        selection: new Set<Project>()
    });
    React.useEffect(() => {
        projectService.findAll(pagination)
            .then(async response => {
                const body = await response.json();
                if (!response.ok)
                    throw body as Error;
                dispatch({ type: "page.change", payload: body as Page<Project> });
            })
            .catch(setError);
    }, [pagination]);
    return (
        <Box>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                {selection.size > 0
                    ? (
                        <Typography sx={{ flex: "1 1 100%" }} variant="subtitle1">
                            {selection.size} {locale.components.table.selection.toLowerCase()}
                        </Typography>
                    )
                    : (
                        <Typography sx={{ flex: "1 1 100%" }} variant="h6">
                            {locale.schemas.project.plural}
                        </Typography>
                    )}
                {selection.size > 0
                    ? (
                        <Tooltip title={locale.actions.delete}>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    : (
                        <Button startIcon={<AddIcon />} variant="contained">{locale.actions.create}</Button>
                        // <Tooltip title={locale.actions.filter}>
                        //     <IconButton>
                        //         <FilterListIcon />
                        //     </IconButton>
                        // </Tooltip>
                    )}
            </Toolbar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selection.size > 0 && selection.size < (page?.length ?? 0)}
                                    checked={selection.size > 0 && selection.size == (page?.length ?? 0)}
                                    onChange={event => dispatch({
                                        type: "selection.change",
                                        payload: event.target.checked && selection.size == 0
                                            ? page?.content
                                            : undefined
                                    })}
                                />
                            </TableCell>
                            {(["name", "description", "leader"] as (keyof Project)[]).map(property => (
                                <TableCell>
                                    <TableSortLabel
                                        direction={pagination.sort?.get(property) ?? "asc"}
                                        key={property}
                                        onClick={() => dispatch({
                                            type: "pagination.sort.toggle.one",
                                            payload: property
                                        })}
                                    >
                                        {locale.schemas.project.properties[property]}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {page?.content.map(project => (
                            <TableRow
                                hover
                                key={`project-${project.id}`}
                                onClick={() => dispatch({
                                    type: "selection.toggle.one",
                                    payload: project
                                })}
                                tabIndex={-1}
                                selected={selection.has(project)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selection.has(project)} />
                                </TableCell>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.description}</TableCell>
                                <TableCell>{user!.name} {user!.surname}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={page?.totalItems ?? 0}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${locale.prepositions.of} ${count}`}
                labelRowsPerPage={locale.components.table.pagination}
                onPageChange={(event, page) => dispatch({
                    type: "pagination.page.change",
                    payload: page
                })}
                onRowsPerPageChange={event => dispatch({
                    type: "pagination.size.change",
                    payload: +event.target.value
                })}
                page={pagination.page!}
                rowsPerPage={pagination.size!}
                rowsPerPageOptions={[5, 10, 20]}
            />
        </Box >
    );
}