import React from "react";

import {
	Box as MuiBox,
	TablePagination as MuiTablePagination
} from "@mui/material";

import Main, { MainContextValue } from "component/main";
import CollaborationTableHead from "component/project/collaboration/table/head";

import Pagination from "model/common/pagination";

interface Setup {
	readonly options: number[];
}

const setup: Setup = {
	options: [5, 10, 20]
};

interface State {
	value: Required<Pagination>;
}

const defaultState: State = {
	value: {
		page: 0,
		size: setup.options[0],
		sort: CollaborationTableHead.defaultState.sort
	}
};

type Action =
	{ type: "value.change", payload: Required<Pagination> }
	;

function reducer(state: State, action: Action): State {
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
	value?: Required<Pagination>,
	onChange?: (pagination: Required<Pagination>) => void
};

function Component({
	count,
	value,
	onChange
}: Properties) {
	const initialState: State = {
		...defaultState,
		...(value !== undefined && { value })
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const locale: any = require(`locale/${mainContext.state.locale}/project/table/pagination.json`);
	const options: number[] = [5, 10, 20];
	return (
		<MuiTablePagination
			component="div"
			count={count ?? 0}
			page={state.value.page}
			rowsPerPage={state.value.size}
			rowsPerPageOptions={options}
			labelRowsPerPage={locale.rowsPerPage}
			labelDisplayedRows={({ from, to, count }) => (
				<MuiBox component="span" textAlign="right" width={64}>
					{count !== undefined && `${from} - ${to} / ${count}`}
				</MuiBox>
			)}
			onPageChange={(event, page) => {
				const pagination: Required<Pagination> = {
					...state.value,
					page
				};
				dispatch({ type: "value.change", payload: pagination });
				onChange?.(pagination);
			}}
			onRowsPerPageChange={event => {
				const size: number = +event.target.value;
				const pagination: Required<Pagination> = {
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

export type CollaborationTablePaginationSetup = Setup;
export type CollaborationTablePaginationState = State;
export type CollaborationTablePaginationAction = Action;
export type CollaborationTablePaginationContextValue = ContextValue;
export type CollaborationTablePaginationProperties = Properties;
export const CollaborationTablePagination = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default CollaborationTablePagination;
