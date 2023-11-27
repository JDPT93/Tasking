import React from "react";

import {
	Box as MuiBox,
	TablePagination as MuiTablePagination
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";

import Pagination, { defaultPagination } from "model/common/pagination";

interface State {
	value: Pagination;
}

export const defaultState: State = {
	value: defaultPagination
};

type Action =
	{ type: "value.change", payload: Pagination }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "value.change": {
			return {
				...state,
				value: action.payload
			};
		}
	}
}

interface ContextValue {
	readonly state: State;
	readonly dispatch?: (action: Action) => void;
}

const Context = React.createContext<ContextValue>({ state: defaultState });

type Properties = {
	count?: number,
	value?: Pagination,
	onChange?: (pagination: Pagination) => void
};

function Component({
	count,
	value,
	onChange
}: Properties) {
	const options: number[] = [5, 10, 20];
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/table/pagination.json`);
	const initialState: State = {
		...defaultState,
		...(value !== undefined && { value })
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<MuiTablePagination
			component="div"
			count={count ?? 0}
			page={state.value.page}
			rowsPerPage={state.value.size}
			rowsPerPageOptions={options}
			labelRowsPerPage={locale.rowsPerPage}
			labelDisplayedRows={({ from, to, count }) => (
				<MuiBox component="span" textAlign="right">
					{count > 0 && `${from} - ${to} / ${count}`}
				</MuiBox>
			)}
			onPageChange={(event, page) => {
				const pagination: Pagination = {
					...state.value,
					page
				};
				dispatch({ type: "value.change", payload: pagination });
				onChange?.(pagination);
			}}
			onRowsPerPageChange={event => {
				const size: number = +event.target.value;
				const pagination: Pagination = {
					...state.value,
					page: Math.floor(state.value.page * state.value.size / size),
					size
				};
				dispatch({ type: "value.change", payload: pagination });
				onChange?.(pagination);
			}}
		/>
	);
}

export type ProjectTablePaginationContextValue = ContextValue;
export type ProjectTablePaginationProperties = Properties;

export const ProjectTablePagination = Component;
export const ProjectTablePaginationContext = Context;

export default ProjectTablePagination;
