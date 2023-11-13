import React from "react";

import {
	TableHead as MuiTableHead,
	TableRow as MuiTableRow,
	TableCell as MuiTableCell,
	TableSortLabel as MuiTableSortLabel
} from "@mui/material";

import Main, { MainContextValue } from "component/main";

import Sort, { orderBy } from "model/common/sort";

interface Setup {

}

const setup: Setup = {

};

interface State {
	sort: Sort
}

const defaultState: State = {
	sort: {}
};

type Action =
	{ type: "sort.change", payload: any }
	;

function reducer(state: State, action: Action): State {
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
	const initialState: State = {
		...defaultState,
		...(sort !== undefined && { sort })
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const locale: any = require(`locale/${mainContext.state.locale}/project/table/head.json`);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiTableHead>
				<MuiTableRow>
					<MuiTableCell width="25%">
						<MuiTableSortLabel
							direction={state.sort["project.name"]}
							onClick={event => {
								const sort: Sort = { ...state.sort };
								orderBy("project.name", sort);
								dispatch({ type: "sort.change", payload: sort });
								onSort?.(sort);
							}}
						>
							{locale.columns.name}
						</MuiTableSortLabel>
					</MuiTableCell>
					<MuiTableCell width="calc(50% - 68px)">
						<MuiTableSortLabel
							direction={state.sort["project.description"]}
							onClick={event => {
								const sort: Sort = { ...state.sort };
								orderBy("project.description", sort);
								dispatch({ type: "sort.change", payload: sort });
								onSort?.(sort);
							}}
						>
							{locale.columns.description}
						</MuiTableSortLabel>
					</MuiTableCell>
					<MuiTableCell width="25%">
						<MuiTableSortLabel
							direction={state.sort["project.leader.name"]}
							onClick={event => {
								const sort: Sort = { ...state.sort };
								orderBy("project.leader.name", sort);
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
		</Context.Provider>
	);
}

export type CollaborationTableHeadSetup = Setup;
export type CollaborationTableHeadState = State;
export type CollaborationTableHeadAction = Action;
export type CollaborationTableHeadContextValue = ContextValue;
export type CollaborationTableHeadProperties = Properties;
export const CollaborationTableHead = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default CollaborationTableHead;