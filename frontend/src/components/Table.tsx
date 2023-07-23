import * as React from "react";
import { Box, Button, Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Skeleton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import Page from "../payloads/Page";
import TableReducer from "../reducers/TableReducer";
import Pagination from "../payloads/Pagination";
import ObjectUtils from "../utils/ObjectUtils";

interface Column<T> {
    label: string;
    map?: (value: any, property: string, object: T) => any;
    path: string;
    width?: number | string;
}

interface Properties<T> {
    caption: string;
    columns: Column<T>[];
    onError?: (error: Error) => void
    onDelete?: (selection: Set<T>) => Promise<Response>;
    onRetrieve: (pagination: Pagination<T>) => Promise<Response>;
    tools: React.ReactNode;
}

export default function GenericTable<T>({ caption, columns, onError, onDelete, onRetrieve, tools }: Properties<T>) {
    const [open, setOpen] = React.useState(false);
    const locale = React.useContext(LocaleContext);
    const [{ pagination, page, selection }, dispatch] = React.useReducer(TableReducer<T>, {
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
                            <IconButton onClick={event => setOpen(true)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>}
                        <Dialog
                            open={open}
                            onClose={() => setOpen(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Eliminar Proyecto"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {
                                        (selection.size > 1)
                                            ?
                                            <Typography variant="subtitle1">{"¿Seguro de eliminar todos los seleccionados?"}</Typography>
                                            :
                                            <Typography variant="subtitle1">{"¿Eliminar este proyecto?"}</Typography>
                                    }
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>{locale.actions.cancel}</Button>
                                <Button onClick={() => {
                                    if (onDelete !== undefined) {
                                        onDelete(selection)
                                            .then(async response => {
                                                const body = await response.json();
                                                if (!response.ok) {
                                                    throw body as Error;
                                                }
                                                dispatch({ type: "selection.delete" });
                                            })
                                            .catch(onError);
                                    }
                                }} autoFocus>
                                    {locale.actions.delete}
                                </Button>
                            </DialogActions>
                        </Dialog>
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
                                <TableCell key={`column-${index}`} width={column.width}>
                                    <TableSortLabel
                                        direction={pagination.sort?.get(column.path) ?? "asc"}
                                        onClick={event => dispatch({
                                            type: "pagination.sort.toggle.one",
                                            payload: column.path
                                        })}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ "&>tr:last-child>td, &>tr:last-child>th": { border: 0 } }}>
                        {page == undefined
                            ? Array.from({ length: pagination?.size ?? 5 }, (_, index) =>
                                <TableRow key={`row-${index}`}>
                                    <TableCell padding="checkbox">
                                        <Skeleton height={20} sx={{ m: "auto" }} variant="rounded" width={20} />
                                    </TableCell>
                                    {columns.map((column, index) =>
                                        <TableCell key={`cell-${index}`}>
                                            <Skeleton height={20} variant="rounded" />
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                            : page.content.map((object, index) =>
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
                                                ? ObjectUtils.query(object, column.path)
                                                : column.map(
                                                    ObjectUtils.query(object, column.path),
                                                    column.path,
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
                labelDisplayedRows={({ from, to, count }) => count > 0 ? `${from}-${to} / ${count}` : <Skeleton height={20} variant="rounded" width={60} />}
                labelRowsPerPage={locale.components.table.rowsPerPage}
                onPageChange={(event, page) => dispatch({
                    type: "pagination.page.change",
                    payload: page
                })}
                onRowsPerPageChange={event => dispatch({
                    type: "pagination.size.change",
                    payload: +event.target.value
                })}
                page={pagination.page ?? 0}
                rowsPerPage={pagination.size ?? 5}
                rowsPerPageOptions={[5, 10, 20]}
            />
        </Box>
    );
}