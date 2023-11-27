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

import { MainContext, MainContextValue } from "component/main";
import CollaborationDialog from "component/project/collaboration/dialog";
import Collaboration from "model/project/collaboration";

interface State {
	readonly delete: boolean;
}

export const defaultState: State = {
	delete: false
};

type Action =
	{ type: "delete.toggle" }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "delete.toggle": {
			return {
				...state,
				delete: !state.delete
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
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/collaboration/menu.json`);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiMenu anchorEl={anchor} open={anchor !== null} onClose={onClose}>
				<MuiMenuItem
					onClick={() => {
						dispatch({ type: "delete.toggle" });
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
				open={state.delete}
				value={value}
				variant="leave"
				onCancel={() => dispatch({ type: "delete.toggle" })}
				onError={onError}
				onSuccess={(value: Collaboration) => {
					dispatch({ type: "delete.toggle" });
					setTimeout(() => onDelete?.(value), 250);
				}}
			/>
		</Context.Provider>
	);
}

export type CollaborationMenuContextValue = ContextValue;
export type CollaborationMenuProperties = Properties;

export const CollaborationMenu = Component;
export const CollaborationMenuContext = Context;

export default CollaborationMenu;
