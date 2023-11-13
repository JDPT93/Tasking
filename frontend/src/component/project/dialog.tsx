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
import ProjectForm from "component/project/form";

import Changelog from "model/common/changelog";
import Project from "model/project/project";

import projectService from "service/project/project-service";

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
	onCancel?: () => void,
	onError?: (error: Error) => void
} & ({
	value?: Project,
	variant: "create",
	onSuccess?: (value: Project) => void
} | {
	value: Project,
	variant: "update",
	onSuccess?: (changelog: Changelog<Project>) => void
} | {
	value: Project,
	variant: "delete",
	onSuccess?: (value: Project) => void
});

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
	const locale: any = require(`locale/${mainContext.state.locale}/project/dialog.json`);
	switch (variant) {
		case "create": {
			return (
				<Context.Provider value={{ state, dispatch }}>
					<MuiDialog open={open} onClose={onCancel}>
						<MuiDialogContent>
							<ProjectForm
								value={value}
								variant={variant}
								onCancel={onCancel}
								onError={onError}
								onSuccess={onSuccess}
							/>
						</MuiDialogContent>
					</MuiDialog>
				</Context.Provider>
			);
		}
		case "update": {
			return (
				<Context.Provider value={{ state, dispatch }}>
					<MuiDialog open={open} onClose={onCancel}>
						<MuiDialogContent>
							<ProjectForm
								value={value}
								variant={variant}
								onCancel={onCancel}
								onError={onError}
								onSuccess={onSuccess}
							/>
						</MuiDialogContent>
					</MuiDialog>
				</Context.Provider>
			);
		}
		case "delete": {
			return (
				<Context.Provider value={{ state, dispatch }}>
					<MuiDialog fullWidth open={open} onClose={onCancel}>
						<MuiDialogTitle alignItems="center">
							{locale.titles[variant]}
						</MuiDialogTitle>
						<MuiDialogContent>
							<MuiDialogContentText paragraph>{locale.messages[variant]}</MuiDialogContentText>
							<MuiDialogContentText variant="subtitle2">{locale.labels.name}</MuiDialogContentText>
							<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.name}</MuiDialogContentText>
							<MuiDialogContentText variant="subtitle2">{locale.labels.description}</MuiDialogContentText>
							<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.description}</MuiDialogContentText>
						</MuiDialogContent>
						<MuiDialogActions>
							<MuiButton onClick={onCancel}>{locale.actions.cancel}</MuiButton>
							<MuiButton
								autoFocus
								variant="contained"
								onClick={() => {
									projectService.deleteById(value.id)
										.then(async (response: Response) => {
											const body: any = await response.json();
											if (!response.ok) {
												const error: { message: string } = body;
												throw new Error(error.message);
											}
											const project: Project = body;
											onSuccess?.(project);
										})
										.catch((error: Error) => {
											onError?.(error);
										});
								}}
							>
								{locale.actions.delete}
							</MuiButton>
						</MuiDialogActions>
					</MuiDialog >
				</Context.Provider >
			);
		}
	}
}

export type ProjectDialogSetup = Setup;
export type ProjectDialogState = State;
export type ProjectDialogAction = Action;
export type ProjectDialogContextValue = ContextValue;
export type ProjectDialogProperties = Properties;
export const ProjectDialog = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectDialog;
