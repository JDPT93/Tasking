import React from "react";

import {
	Delete as DeleteIcon,
	ExitToApp as ExitToAppIcon
} from "@mui/icons-material";

import {
	ListItemIcon as MuiListItemIcon,
	ListItemText as MuiListItemText,
	MenuItem as MuiMenuItem,
	Menu as MuiMenu
} from "@mui/material";

import Main, { MainContextValue } from "component/main";
import CollaborationDialog from "component/project/collaboration/dialog";

import Collaboration from "model/project/collaboration";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly dialog: {
		readonly open: boolean
	};
}

const defaultState: State = {
	dialog: {
		open: false
	}
};

type Action =
	{ type: "dialog.close" } |
	{ type: "dialog.open" }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "dialog.close": {
			return {
				...state,
				dialog: {
					...state.dialog,
					open: false
				}
			};
		}
		case "dialog.open": {
			return {
				...state,
				dialog: {
					...state.dialog,
					open: true
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
	value: Collaboration,
	onClose?: () => void,
	onError?: (error: Error) => void,
	onDelete?: (value: Collaboration) => void
};

function Component({
	anchor,
	value,
	onClose,
	onError,
	onDelete
}: Properties) {
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/collaboration/menu.json`);
	if (anchor !== null) console.log(value)
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiMenu anchorEl={anchor} open={anchor !== null} onClose={onClose}>
				<MuiMenuItem
					onClick={() => {
						dispatch({ type: "dialog.open" });
						onClose?.();
					}}
				>
					<MuiListItemIcon>
						<ExitToAppIcon fontSize="small" />
					</MuiListItemIcon>
					<MuiListItemText>{locale.actions.leave}</MuiListItemText>
				</MuiMenuItem>
			</MuiMenu>
			<CollaborationDialog
				open={state.dialog.open}
				value={value}
				variant="leave"
				onCancel={() => dispatch({ type: "dialog.close" })}
				onError={onError}
				onSuccess={(value: Collaboration) => {
					dispatch({ type: "dialog.close" });
					setTimeout(() => onDelete?.(value), 250);
				}}
			/>
		</Context.Provider>
	);
}

export type CollaborationMenuSetup = Setup;
export type CollaborationMenuState = State;
export type CollaborationMenuAction = Action;
export type CollaborationMenuContextValue = ContextValue;
export type CollaborationMenuProperties = Properties;
export const CollaborationMenu = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default CollaborationMenu;
