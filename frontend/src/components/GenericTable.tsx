import * as React from "react";
import { Box, Button, Checkbox, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import Page from "../payloads/Page";
import GenericTableReducer from "../reducers/GenericTableReducer";
import Pagination from "../payloads/Pagination";

interface Column<T> {
    property: string;
    label: string
    map?: (value: any, property: string, object: T) => any;
}

interface Properties<T> {
    caption: string;
    columns: Column<T>[];
    onError?: (error: Error) => void
    onDelete?: (selection: Set<T>) => Promise<Response>;
    onRetrieve: (pagination: Pagination<T>) => Promise<Response>;
    tools: React.ReactNode;
}

function queryObject<T>(object: T, query: string): any {
    const [key, subquery] = query.split(".", 2);
    return subquery === undefined
        ? object[key as keyof T]
        : queryObject(object[key as keyof T], subquery);
}

export default function GenericTable<T>({ caption, columns, onError, onDelete, onRetrieve, tools }: Properties<T>) {
    const locale = React.useContext(LocaleContext);
    const [{ pagination, page, selection }, dispatch] = React.useReducer(GenericTableReducer<T>, {
        pagination: { page: 0, size: 5 },
        selection: new Set<T>()
    });
    React.useEffect(() => {
        onRetrieve(pagination)
            .then(async response => {
                const body = await response.json();
                if (!response.ok) {
                    throw body as Error;
                }
                dispatch({ type: "page.change", payload: body as Page<T> });
            })
            .catch(error => {
                if (onError !== undefined) {
                    onError(error);
                }
            });
    }, [pagination]);
    return (
        <Box sx={{ p: 2 }}>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                {selection.size > 0
                    ? <>
                        <Typography flex="1 1 100%" variant="subtitle1">
                            {locale.components.table.selectedRows}: {selection.size}
                        </Typography>
                        {onDelete !== undefined && <Tooltip title={locale.actions.delete}>
                            <IconButton onClick={event => {
                                // TODO: show confirm dialog
                                onDelete(selection)
                                    .then(async response => {
                                        const body = await response.json();
                                        if (!response.ok) {
                                            throw body as Error;
                                        }
                                        dispatch({ type: "selection.delete" });
                                    })
                                    .catch(error => {
                                        if (onError !== undefined) {
                                            onError(error);
                                        }
                                    });
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>}
                    </>
                    : <>
                        <Typography flex="1 1 100%" variant="h6">{caption}</Typography>
                        {tools}
                    </>}
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
                                            : column.map(
                                                queryObject(object, column.property),
                                                column.property,
                                                object
                                            )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
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
        </Box>
    );
}