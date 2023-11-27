import React from "react";

import {
	TableHead as MuiTableHead,
	TableRow as MuiTableRow,
	TableCell as MuiTableCell,
	TableSortLabel as MuiTableSortLabel
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";

import Sort, { defaultSort, orderBy } from "model/common/sort";

interface State {
	sort: Sort
}

export const defaultState: State = {
	sort: defaultSort
};

type Action =
	{ type: "sort.change", payload: any }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "sort.change": {
			return {
				...state,
				sort: action.payload
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
	sort?: Sort,
	onSort?: (sort: Sort) => void
};

function Component({
	sort,
	onSort
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/table/head.json`);
	const initialState: State = {
		...defaultState,
		...(sort !== undefined && { sort })
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiTableHead>
				<MuiTableRow>
					<MuiTableCell width="25%">
						<MuiTableSortLabel
							direction={state.sort["name"]}
							onClick={(event: any) => {
								const sort: Sort = { ...state.sort };
								orderBy("name", sort);
								dispatch({ type: "sort.change", payload: sort });
								onSort?.(sort);
							}}
						>
							{locale.columns.name}
						</MuiTableSortLabel>
					</MuiTableCell>
					<MuiTableCell width="calc(50% - 68px)">
						<MuiTableSortLabel
							direction={state.sort["description"]}
							onClick={(event: any) => {
								const sort: Sort = { ...state.sort };
								orderBy("description", sort);
								dispatch({ type: "sort.change", payload: sort });
								onSort?.(sort);
							}}
						>
							{locale.columns.description}
						</MuiTableSortLabel>
					</MuiTableCell>
					<MuiTableCell width="25%">
						<MuiTableSortLabel
							direction={state.sort["leader.name"]}
							onClick={(event: any) => {
								const sort: Sort = { ...state.sort };
								orderBy("leader.name", sort);
								dispatch({ type: "sort.change", payload: sort });
								onSort?.(sort);
							}}
						>
							{locale.columns.leader}
						</MuiTableSortLabel>
					</MuiTableCell>
					<MuiTableCell width={68} />
				</MuiTableRow>
			</MuiTableHead>
		</Context.Provider >
	);
}

export type ProjectTableHeadContextValue = ContextValue;
export type ProjectTableHeadProperties = Properties;

export const ProjectTableHead = Component;
export const ProjectTableHeadContext = Context;

export default ProjectTableHead;