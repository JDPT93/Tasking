import React from "react";

import {
	Category as CategoryIcon,
	FolderShared as FolderSharedIcon
} from "@mui/icons-material";

import {
	Box as MuiBox,
	Paper as MuiPaper,
	Table as MuiTable,
	TableBody as MuiTableBody,
	TableCell as MuiTableCell,
	TableContainer as MuiTableContainer,
	TableRow as MuiTableRow,
	Toolbar as MuiToolbar,
	Typography as MuiTypography
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";
import CollaborationTableHead from "component/project/collaboration/table/head";
import CollaborationTablePagination from "component/project/collaboration/table/pagination";
import CollaborationTableRow from "component/project/collaboration/table/row";

import Changelog from "model/common/changelog";
import Page, { defaultPage } from "model/common/page";
import Pagination, { defaultPagination } from "model/common/pagination";
import Sort from "model/common/sort";
import Collaboration from "model/project/collaboration";

import collaborationService from "service/project/collaboration-service";

interface State {
	readonly page: Page<Collaboration>;
	readonly pagination: Pagination;
	readonly ready: boolean;
}

export const defaultState: State = {
	page: defaultPage,
	pagination: defaultPagination,
	ready: false
};

type Action =
	{ type: "page.load", payload: Page<Collaboration> } |
	{ type: "page.reload" } |
	{ type: "pagination.change", payload: Pagination }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "page.load": {
			return {
				...state,
				page: action.payload,
				ready: true
			};
		}
		case "page.reload": {
			return {
				...state,
				ready: false
			};
		}
		case "pagination.change": {
			return {
				...state,
				pagination: action.payload,
				ready: false
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
	secondaryAction?: any,
	onError?: (error: Error) => void,
	onDelete?: (value: Collaboration) => void,
	onRetrieve?: (page: Page<Collaboration>, pagination: Pagination) => void,
	onUpdate?: (page: Changelog<Collaboration>) => void
};

function Component({
	secondaryAction,
	onError,
	onDelete,
	onRetrieve,
	onUpdate
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/collaboration/table/table.json`);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	React.useEffect(() => {
		if (!state.ready) {
			collaborationService.retrieveAll(state.pagination)
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Collaboration> = body;
					dispatch({ type: "page.load", payload: page });
					onRetrieve?.(page, state.pagination);
				})
				.catch((error: Error) => {
					onError?.(error);
				});
		}
	}, [state.ready]);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiBox>
				<MuiToolbar>
					<FolderSharedIcon />
					<MuiTypography marginLeft={1} variant="h6">{locale.title}</MuiTypography>
					<MuiBox flexGrow={1} />
					{secondaryAction}
				</MuiToolbar>
				<MuiTableContainer component={MuiPaper}>
					<MuiTable sx={{ minWidth: 650 }}>
						<CollaborationTableHead
							onSort={(sort: Sort) => {
								const pagination: Pagination = {
									...state.pagination,
									sort
								};
								dispatch({ type: "pagination.change", payload: pagination });
							}}
							sort={state.pagination.sort}
						/>
						<MuiTableBody>
							{(state.ready ? state.page.content : Array(state.pagination.size))
								.map((collaboration: Collaboration | undefined, index: number) => (
									<CollaborationTableRow
										key={`collaboration-${index}`}
										value={collaboration}
										onDelete={(value: Collaboration) => {
											dispatch({ type: "page.reload" });
											onDelete?.(value);
										}}
									/>
								))}
							{state.ready && state.page.empty && (
								<MuiTableRow>
									<MuiTableCell align="center" colSpan={4} height={285}>
										<CategoryIcon fontSize="large" sx={{ color: "text.secondary" }} />
										<MuiTypography color="text.secondary">{locale.messages.empty}</MuiTypography>
									</MuiTableCell>
								</MuiTableRow>
							)}
						</MuiTableBody>
					</MuiTable>
					<CollaborationTablePagination
						count={state.page.totalElements}
						onChange={(pagination: Pagination) => dispatch({ type: "pagination.change", payload: pagination })}
						value={state.pagination}
					/>
				</MuiTableContainer>
			</MuiBox>
		</Context.Provider>
	);
}

export type CollaborationTableContextValue = ContextValue;
export type CollaborationTableProperties = Properties;

export const CollaborationTable = Component;
export const CollaborationTableContext = Context;

export default CollaborationTable;
