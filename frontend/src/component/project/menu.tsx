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

import Main, { MainContextValue } from "component/main";
import ProjectDialog from "component/project/dialog";

import Project from "model/project/project";
import Changelog from "model/common/changelog";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly dialog: {
		readonly open: "delete" | "update" | null
	};
}

const defaultState: State = {
	dialog: {
		open: null
	}
};

type Action =
	{ type: "dialog.close" } |
	{ type: "dialog.open", payload: "delete" | "update" }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "dialog.close": {
			return {
				...state,
				dialog: {
					...state.dialog,
					open: null
				}
			};
		}
		case "dialog.open": {
			return {
				...state,
				dialog: {
					...state.dialog,
					open: action.payload
				}
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
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/menu.json`);
	if (anchor !== null) console.log(value)
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiMenu anchorEl={anchor} open={anchor !== null} onClose={onClose}>
				<MuiMenuItem
					onClick={() => {
						dispatch({ type: "dialog.open", payload: "update" });
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
						dispatch({ type: "dialog.open", payload: "delete" });
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
				open={state.dialog.open === "delete"}
				value={value}
				variant="delete"
				onCancel={() => dispatch({ type: "dialog.close" })}
				onError={onError}
				onSuccess={(value: Project) => {
					dispatch({ type: "dialog.close" });
					setTimeout(() => onDelete?.(value), 250);
				}}
			/>
			<ProjectDialog
				open={state.dialog.open === "update"}
				value={value}
				variant="update"
				onCancel={() => dispatch({ type: "dialog.close" })}
				onError={onError}
				onSuccess={(changelog: Changelog<Project>) => {
					dispatch({ type: "dialog.close" });
					setTimeout(() => onUpdate?.(changelog), 250);
				}}
			/>
		</Context.Provider>
	);
}

export type ProjectMenuSetup = Setup;
export type ProjectMenuState = State;
export type ProjectMenuAction = Action;
export type ProjectMenuContextValue = ContextValue;
export type ProjectMenuProperties = Properties;
export const ProjectMenu = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectMenu;
