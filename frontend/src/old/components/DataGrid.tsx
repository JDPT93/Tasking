import * as React from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button, Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Skeleton } from "@mui/material";

import LocaleContext from "../contexts/LocaleContext";

import Page from "../../model/page";
import Pagination from "../../model/pagination";

import DataGridReducer, { DataGridState } from "../reducers/DataGridReducer";

import ObjectUtils from "../utils/ObjectUtils";

interface Column<T> {
  label: string;
  map?: (value: any, property: string, object: T) => any;
  path: string;
  skeleton: React.ReactNode;
  width?: number | string;
}

interface Properties<T> {
  caption: string;
  columns: Column<T>[];
  onError?: (error: Error) => void
  onRequestDelete?: (selection: Set<T>) => Promise<Response>;
  onRequestRetrieve: (pagination: Pagination) => Promise<Response>;
  tools: React.ReactNode;
}

export default function DataGrid<T>({ caption, columns, onError, onRequestDelete, onRequestRetrieve, tools }: Properties<T>) {
  const [open, setOpen] = React.useState(false);
  const locale = React.useContext(LocaleContext);
  const [{ pagination, page, selection }, dispatch] = React.useReducer(DataGridReducer<T>, {
    pagination: { page: 0, size: 5, sort: new Map() },
    selection: new Set()
  } as DataGridState<T>);
  React.useEffect(() => {
    onRequestRetrieve(pagination)
      .then(async response => {
        const body = await response.json();
        if (!response.ok) {
          throw body as Error;
        }
        dispatch({ type: "page.set", payload: body as Page<T> });
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
          ? (
            <>
              <Typography flex="1 1 100%" variant="subtitle1">
                {locale.components.table.selectedRows}: {selection.size}
              </Typography>
              {onRequestDelete !== undefined && <Tooltip title={locale.actions.delete}>
                <IconButton onClick={event => setOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>}
              <Dialog open={open} onClose={event => setOpen(false)}>
                <DialogTitle>{"Eliminar Proyecto"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Typography variant="subtitle1">
                      {selection.size === 1
                        ? "¿Eliminar este proyecto?"
                        : "¿Seguro de eliminar todos los seleccionados?"}
                    </Typography>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>{locale.actions.cancel}</Button>
                  <Button onClick={() => {
                    if (onRequestDelete !== undefined) {
                      onRequestDelete(selection)
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
          )
          : (
            <>
              <Typography flex="1 1 100%" variant="h6">{caption}</Typography>
              {tools}
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
                    type: "selection.set",
                    payload: event.target.checked && selection.size === 0
                      ? page?.content
                      : undefined
                  })}
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell key={`column-${index}`} width={column.width}>
                  <TableSortLabel
                    direction={pagination.sort?.get(column.path) ?? "asc"}
                    onClick={event => dispatch({
                      type: "pagination.sort.item.toggle",
                      payload: column.path
                    })}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ "&>tr:last-child>td, &>tr:last-child>th": { border: 0 } }}>
            {page == undefined
              ? Array.from({ length: pagination?.size ?? 5 }, (_, index) =>
                <TableRow key={`row-${index}`}>
                  <TableCell padding="checkbox">
                    <Skeleton height={20} sx={{ margin: "auto" }} variant="rounded" width={20} />
                  </TableCell>
                  {columns.map((column, index) => (
                    <TableCell key={`cell-${index}`}>{column.skeleton}</TableCell>
                  ))}
                </TableRow>
              )
              : page.content.map((object, index) =>
                <TableRow
                  hover
                  key={`row-${index}`}
                  onClick={event => dispatch({
                    type: "selection.item.toggle",
                    payload: object
                  })}
                  tabIndex={-1}
                  selected={selection.has(object)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selection.has(object)} />
                  </TableCell>
                  {columns.map((column, index) => (
                    <TableCell key={`cell-${index}`}>
                      {column.map === undefined
                        ? ObjectUtils.query(object, column.path)
                        : column.map(
                          ObjectUtils.query(object, column.path),
                          column.path,
                          object
                        )}
                    </TableCell>
                  ))}
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={page?.totalItems ?? 0}
        labelDisplayedRows={({ from, to, count }) => `${from} ${locale.components.table.to} ${to} ${locale.components.table.of} ${count}`}
        labelRowsPerPage={locale.components.table.rowsPerPage}
        onPageChange={(event, page) => dispatch({
          type: "pagination.page.set",
          payload: page
        })}
        onRowsPerPageChange={event => dispatch({
          type: "pagination.size.set",
          payload: +event.target.value
        })}
        page={pagination.page ?? 0}
        rowsPerPage={pagination.size ?? 5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
}