import React from "react";

import {
	Button as MuiButton,
	Dialog as MuiDialog,
	DialogActions as MuiDialogActions,
	DialogContent as MuiDialogContent,
	DialogContentText as MuiDialogContentText,
	DialogTitle as MuiDialogTitle
} from "@mui/material";

import Main, { MainContextValue } from "component/main";

import Collaboration from "model/project/collaboration";

import collaborationService from "service/project/collaboration-service";

interface Setup {

}

const setup: Setup = {

};

interface State {

}

const defaultState: State = {

};

type Action =
	{ type: "", payload: any }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "": {
			return {
				...state,

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
	open: boolean,
	value: Collaboration,
	variant: "leave"
	onCancel?: () => void,
	onError?: (error: Error) => void
	onSuccess?: (value: Collaboration) => void
};

function Component({
	open,
	value,
	variant,
	onCancel,
	onError,
	onSuccess
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const locale: any = require(`locale/${mainContext.state.locale}/project/collaboration/dialog.json`);
	switch (variant) {
		case "leave": {
			return (
				<Context.Provider value={{ state, dispatch }}>
					<MuiDialog fullWidth open={open} onClose={onCancel}>
						<MuiDialogTitle alignItems="center">
							{locale.titles[variant]}
						</MuiDialogTitle>
						<MuiDialogContent>
							<MuiDialogContentText paragraph>{locale.messages[variant]}</MuiDialogContentText>
							<MuiDialogContentText variant="subtitle2">{locale.labels.name}</MuiDialogContentText>
							<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.project.name}</MuiDialogContentText>
							<MuiDialogContentText variant="subtitle2">{locale.labels.description}</MuiDialogContentText>
							<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.project.description}</MuiDialogContentText>
						</MuiDialogContent>
						<MuiDialogActions>
							<MuiButton onClick={onCancel}>{locale.actions.cancel}</MuiButton>
							<MuiButton
								autoFocus
								variant="contained"
								onClick={() => {
									collaborationService.deleteById(value.id)
										.then(async (response: Response) => {
											const body: any = await response.json();
											if (!response.ok) {
												const error: { message: string } = body;
												throw new Error(error.message);
											}
											const collaboration: Collaboration = body;
											onSuccess?.(collaboration);
										})
										.catch((error: Error) => {
											onError?.(error);
										});
								}}
							>
								{locale.actions.leave}
							</MuiButton>
						</MuiDialogActions>
					</MuiDialog >
				</Context.Provider >
			);
		}
	}
}

export type CollaborationDialogSetup = Setup;
export type CollaborationDialogState = State;
export type CollaborationDialogAction = Action;
export type CollaborationDialogContextValue = ContextValue;
export type CollaborationDialogProperties = Properties;
export const CollaborationDialog = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default CollaborationDialog;
