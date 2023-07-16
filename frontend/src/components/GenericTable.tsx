import * as React from "react";
import { Box, Button, Checkbox, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, FilterList as FilterListIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import Page from "../payloads/Page";
import GenericTableReducer from "../reducers/GenericTableReducer";
import Service from "../services/Service";

interface Column<T> {
    property: string;
    label: string
    map?: (value: any, property: string, object: T) => any;
}

interface Properties<T> {
    caption: string;
    columns: Column<T>[];
    service: Service<T>;
}

function queryObject<T>(object: T, query: string): any {
    const [property, subquery] = query.split(".", 2);
    const value = object[property as keyof T];
    return subquery === null ? value : queryObject(value, subquery);
}

export default function GenericTable<T>({ caption, columns, service }: Properties<T>) {
    const locale = React.useContext(LocaleContext);
    const { setError } = React.useContext(ErrorContext);
    const { user } = React.useContext(UserContext);
    const [{ pagination, page, selection }, dispatch] = React.useReducer(GenericTableReducer<T>, {
        pagination: { page: 0, size: 5 },
        selection: new Set<T>()
    });
    React.useEffect(() => {
        service.findAll(pagination)
            .then(async response => {
                const body = await response.json();
                if (!response.ok) {
                    throw body as Error;
                }
                dispatch({ type: "page.change", payload: body as Page<T> });
            })
            .catch(setError);
    }, [pagination]);
    return (
        <Box sx={{ p: 2 }}>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                {selection.size > 0
                    ? (
                        <>
                            <Typography sx={{ flex: "1 1 100%" }} variant="subtitle1">
                                {locale.components.table.selectedRows}: {selection.size}
                            </Typography>
                            <Tooltip title={locale.actions.delete}>
                                <IconButton onClick={event => {

                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )
                    : (
                        <>
                            <Typography sx={{ flex: "1 1 100%" }} variant="h6">{caption}</Typography>
                            <Button startIcon={<AddIcon />} variant="contained">{locale.actions.create}</Button>
                        </>
                    )}
            </Toolbar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selection.size > 0 && selection.size < (page?.length ?? 0)}
                                    checked={selection.size > 0 && selection.size === (page?.length ?? 0)}
                                    onChange={event => dispatch({
                                        type: "selection.change",
                                        payload: event.target.checked && selection.size === 0
                                            ? page?.content
                                            : undefined
                                    })}
                                />
                            </TableCell>
                            {columns.map((column, index) =>
                                <TableCell key={`column-${index}`}>
                                    <TableSortLabel
                                        direction={pagination.sort?.get(column.property) ?? "asc"}
                                        onClick={event => dispatch({
                                            type: "pagination.sort.toggle.one",
                                            payload: column.property
                                        })}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {page?.content.map((object, index) =>
                            <TableRow
                                hover
                                key={`row-${index}`}
                                onClick={event => dispatch({
                                    type: "selection.toggle.one",
                                    payload: object
                                })}
                                tabIndex={-1}
                                selected={selection.has(object)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selection.has(object)} />
                                </TableCell>
                                {columns.map((column, index) =>
                                    <TableCell key={`cell-${index}`}>
                                        {column.map === undefined
                                            ? queryObject(object, column.property)
                                            : column.map(queryObject(object, column.property), column.property, object)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                count={page?.totalItems ?? 0}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
                labelRowsPerPage={locale.components.table.rowsPerPage}
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