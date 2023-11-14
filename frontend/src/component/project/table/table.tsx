import React from "react";

import {
	Category as CategoryIcon,
	Folder as FolderIcon
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

import Main, { MainContextValue } from "component/main";
import ProjectTableHead from "component/project/table/head";
import ProjectTablePagination from "component/project/table/pagination";
import ProjectTableRow from "component/project/table/row";

import Changelog from "model/common/changelog";
import Page, { defaultPage } from "model/common/page";
import Pagination from "model/common/pagination";
import Sort from "model/common/sort";
import Project from "model/project/project";

import projectService from "service/project/project-service";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly page: Page<Project>;
	readonly pagination: Required<Pagination>;
	readonly ready: boolean;
}

const defaultState: State = {
	page: defaultPage,
	pagination: ProjectTablePagination.defaultState.value,
	ready: false
};

type Action =
	{ type: "page.load", payload: Page<Project> } |
	{ type: "page.reload" } |
	{ type: "pagination.change", payload: Required<Pagination> }
	;

function reducer(state: State, action: Action): State {
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
	onDelete?: (value: Project) => void,
	onRetrieve?: (page: Page<Project>, pagination: Pagination) => void
	onUpdate?: (page: Changelog<Project>) => void
};

function Component({
	secondaryAction,
	onError,
	onDelete,
	onRetrieve,
	onUpdate
}: Properties) {
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/table/table.json`);
	React.useEffect(() => {
		if (!state.ready) {
			projectService.retrieveAll(state.pagination)
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const page: Page<Project> = body;
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
					<FolderIcon />
					<MuiTypography marginLeft={1} variant="h6">{locale.title}</MuiTypography>
					<MuiBox flexGrow={1} />
					{secondaryAction}
				</MuiToolbar>
				<MuiTableContainer component={MuiPaper}>
					<MuiTable sx={{ minWidth: 650 }}>
						<ProjectTableHead
							onSort={(sort: Sort) => {
								const pagination: Required<Pagination> = {
									...state.pagination,
									sort
								};
								dispatch({ type: "pagination.change", payload: pagination });
							}}
							sort={state.pagination.sort}
						/>
						<MuiTableBody>
							{(state.ready ? state.page.content : Array(state.pagination.size))
								.map((project: Project | undefined, index: number) => (
									<ProjectTableRow
										key={`project-${index}`}
										value={project}
										onDelete={(value: Project) => {
											dispatch({ type: "page.reload" });
											onDelete?.(value);
										}}
										onUpdate={(changelog: Changelog<Project>) => {
											dispatch({ type: "page.reload" });
											onUpdate?.(changelog);
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
					<ProjectTablePagination
						count={state.page.totalElements}
						onChange={(pagination: Required<Pagination>) => dispatch({ type: "pagination.change", payload: pagination })}
						value={state.pagination}
					/>
				</MuiTableContainer>
			</MuiBox>
		</Context.Provider>
	);
}

export type ProjectTableSetup = Setup;
export type ProjectTableState = State;
export type ProjectTableAction = Action;
export type ProjectTableContextValue = ContextValue;
export type ProjectTableProperties = Properties;
export const ProjectTable = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectTable;
