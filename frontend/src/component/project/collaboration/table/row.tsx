import React from "react";

import {
	Link
} from "react-router-dom";

import {
	MoreVert as MuiMoreVert
} from "@mui/icons-material";

import {
	Box as MuiBox,
	IconButton as MuiIconButton,
	Link as MuiLink,
	Skeleton as MuiSkeleton,
	TableCell as MuiTableCell,
	TableRow as MuiTableRow,
	Typography as MuiTypography
} from "@mui/material";

import CollaborationMenu from "component/project/collaboration/menu";
import UserAvatar from "component/user/avatar";

import Changelog from "model/common/changelog";
import Collaboration from "model/project/collaboration";

interface State {
	readonly menu: HTMLElement | null;
}

export const defaultState: State = {
	menu: null
};

type Action =
	{ type: "menu.close" } |
	{ type: "menu.open", payload: HTMLElement }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "menu.close": {
			return {
				...state,
				menu: null
			};
		}
		case "menu.open": {
			return {
				...state,
				menu: action.payload
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
	value?: Collaboration,
	onDelete?: (value: Collaboration) => void,
	onUpdate?: (page: Changelog<Collaboration>) => void
};

function Component({
	value,
	onDelete
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiTableRow hover>
				<MuiTableCell>
					{value === undefined
						? (<MuiSkeleton height={20} variant="rounded" />)
						: (<MuiLink component={Link} to={`/project/${value.project.id}`}>{value.project.name}</MuiLink>)}
				</MuiTableCell>
				<MuiTableCell>
					{value === undefined
						? (<MuiSkeleton height={20} variant="rounded" />)
						: value.project.description}
				</MuiTableCell>
				<MuiTableCell>
					{value === undefined
						? (
							<MuiBox display="flex" alignItems="center">
								<MuiSkeleton height={24} sx={{ marginRight: 1 }} variant="circular" width={24} />
								<MuiSkeleton height={20} variant="rounded" width="calc(100% - 32px)" />
							</MuiBox>
						)
						: (
							<MuiBox display="flex" alignItems="center">
								<UserAvatar size="small" value={value.project.leader} />
								<MuiTypography marginLeft={1}>{value.project.leader.name}</MuiTypography>
							</MuiBox>
						)}
				</MuiTableCell>
				{value === undefined
					? (<MuiTableCell />)
					: (
						<MuiTableCell sx={{ paddingY: 0 }}>
							<MuiIconButton onClick={(event: any) => dispatch({ type: "menu.open", payload: event.target })}>
								<MuiMoreVert fontSize="small" />
							</MuiIconButton>
							<CollaborationMenu
								anchor={state.menu}
								value={value}
								onClose={() => dispatch({ type: "menu.close" })}
								onDelete={onDelete}
							/>
						</MuiTableCell>
					)}
			</MuiTableRow>
		</Context.Provider>
	);
}

export type ProjectTableRowContextValue = ContextValue;
export type ProjectTableRowProperties = Properties;

export const ProjectTableRow = Component;
export const ProjectTableRowContext = Context;

export default ProjectTableRow;
