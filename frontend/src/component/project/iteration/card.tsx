import React from "react";

import {
	Box,
	Card,
	CardHeader,
	IconButton,
	ListItem,
	ListItemText,
	ListItem as MuiListItem,
	Paper,
	Skeleton,
	Toolbar,
	Typography
} from "@mui/material"
import Iteration from "model/project/iteration";
import Changelog from "model/common/changelog";
import { MoreVert } from "@mui/icons-material";
import IterationMenu from "./menu";

interface State {
	readonly menu: HTMLElement | null
}

export const defaultState: State = {
	menu: null
};

type Action =
	{ type: "menu.close", } |
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
	value?: Iteration,
	onError?: (error: Error) => void,
	onDelete?: (value: Iteration) => void,
	onUpdate?: (changelog: Changelog<Iteration>) => void
};

function Component({
	value,
	onError,
	onDelete,
	onUpdate
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<Card>
				<CardHeader
					action={value !== undefined && (
						<IconButton onClick={(event: any) => dispatch({ type: "menu.open", payload: event.target })}>
							<MoreVert />
						</IconButton>
					)}
					subheader={<Typography variant="body2">{value?.description}</Typography> ?? <Skeleton width="60%" />}
					title={<Typography variant="h6">{value?.name}</Typography> ?? <Skeleton width="30%" />}
				/>
				<Box height={200} />

			</Card>
			{value !== undefined && (<IterationMenu
				anchor={state.menu}
				value={value}
				onClose={() => dispatch({ type: "menu.close" })}
				onError={onError}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>)}
		</Context.Provider>
	);
}

export type IterationListItemContextValue = ContextValue;
export type IterationListItemProperties = Properties;

export const IterationListItem = Component;
export const IterationListItemContext = Context;

export default IterationListItem;
