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
import IterationDialog from "component/project/iteration/dialog";

import Changelog from "model/common/changelog";
import Iteration from "model/project/iteration";

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
	value: Iteration,
	onClose?: () => void,
	onError?: (error: Error) => void,
	onDelete?: (value: Iteration) => void,
	onUpdate?: (changelog: Changelog<Iteration>) => void
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
			<IterationDialog
				open={state.delete}
				value={value}
				variant="delete"
				onCancel={() => dispatch({ type: "delete.toggle" })}
				onError={onError}
				onSuccess={(value: Iteration) => {
					dispatch({ type: "delete.toggle" });
					onDelete?.(value);
				}}
			/>
			<IterationDialog
				open={state.update}
				value={value}
				variant="update"
				onCancel={() => dispatch({ type: "update.toggle" })}
				onError={onError}
				onSuccess={(changelog: Changelog<Iteration>) => {
					dispatch({ type: "update.toggle" });
					onUpdate?.(changelog);
				}}
			/>
		</Context.Provider>
	);
}

export type IterationMenuContextValue = ContextValue;
export type IterationMenuProperties = Properties;

export const IterationMenu = Component;
export const IterationMenuContext = Context;

export default IterationMenu;
