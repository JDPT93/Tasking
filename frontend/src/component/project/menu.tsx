import React from "react";

import {
	Delete as DeleteIcon,
	Edit as EditIcon
} from "@mui/icons-material";

import {
	ListItemIcon as MuiListItemIcon,
	ListItemText as MuiListItemText,
	MenuItem as MuiMenuItem,
	Menu as MuiMenu
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";
import ProjectDialog from "component/project/dialog";

import Project from "model/project/project";
import Changelog from "model/common/changelog";

interface State {
	readonly delete: boolean;
	readonly update: boolean;
}

export const defaultState: State = {
	delete: false,
	update: false
};

type Action =
	{ type: "delete.toggle" } |
	{ type: "update.toggle" }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "delete.toggle": {
			return {
				...state,
				delete: !state.delete
			};
		}
		case "update.toggle": {
			return {
				...state,
				update: !state.update
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
	anchor: HTMLElement | null,
	value: Project,
	onClose?: () => void,
	onError?: (error: Error) => void,
	onDelete?: (value: Project) => void,
	onUpdate?: (changelog: Changelog<Project>) => void
};

function Component({
	anchor,
	value,
	onClose,
	onError,
	onDelete,
	onUpdate
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/menu.json`);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiMenu anchorEl={anchor} open={anchor !== null} onClose={onClose}>
				<MuiMenuItem
					onClick={() => {
						dispatch({ type: "update.toggle" });
						onClose?.();
					}}
				>
					<MuiListItemIcon>
						<EditIcon fontSize="small" />
					</MuiListItemIcon>
					<MuiListItemText>{locale.actions.update}</MuiListItemText>
				</MuiMenuItem>
				<MuiMenuItem
					onClick={() => {
						dispatch({ type: "delete.toggle" });
						onClose?.();
					}}
				>
					<MuiListItemIcon>
						<DeleteIcon fontSize="small" />
					</MuiListItemIcon>
					<MuiListItemText>{locale.actions.delete}</MuiListItemText>
				</MuiMenuItem>
			</MuiMenu>
			<ProjectDialog
				open={state.delete}
				value={value}
				variant="delete"
				onCancel={() => dispatch({ type: "delete.toggle" })}
				onError={onError}
				onSuccess={(value: Project) => {
					dispatch({ type: "delete.toggle" });
					setTimeout(() => onDelete?.(value), 250);
				}}
			/>
			<ProjectDialog
				open={state.update}
				value={value}
				variant="update"
				onCancel={() => dispatch({ type: "update.toggle" })}
				onError={onError}
				onSuccess={(changelog: Changelog<Project>) => {
					dispatch({ type: "update.toggle" });
					setTimeout(() => onUpdate?.(changelog), 250);
				}}
			/>
		</Context.Provider>
	);
}

export type ProjectMenuContextValue = ContextValue;
export type ProjectMenuProperties = Properties;

export const ProjectMenu = Component;
export const ProjectMenuContext = Context;

export default ProjectMenu;
