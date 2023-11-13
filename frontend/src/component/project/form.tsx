import React from "react";

import {
	Folder as FolderIcon
} from "@mui/icons-material";

import {
	Box as MuiBox,
	Button as MuiButton,
	Stack as MuiStack,
	TextField as MuiTextField,
	Typography as MuiTypography
} from "@mui/material";

import Main, { MainContextValue } from "component/main";

import Changelog from "model/common/changelog";
import Project, { defaultProject } from "model/project/project";

import projectService from "service/project/project-service";

interface Setup {

}

const setup: Setup = {

};

interface State {
	readonly value: Project;
}

const defaultState: State = {
	value: defaultProject
};

type Action =
	{ type: "value.set", payload: Project }
	;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "value.set": {
			return {
				...state,
				value: action.payload
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
});

function Component({
	value,
	variant,
	onCancel,
	onError,
	onSuccess
}: Properties) {
	const mainContext: MainContextValue = React.useContext(Main.Context);
	const initialState: State = {
		...defaultState,
		...(value !== undefined && { value })
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const locale: any = require(`locale/${mainContext.state.locale}/project/form.json`);
	return (
		<MuiStack
			component="form"
			spacing={2}
			width={400}
			onSubmit={(event: any) => {
				event.preventDefault();
				projectService[variant](state.value)
					.then(async (response: Response) => {
						const body: any = await response.json();
						if (!response.ok) {
							const error: { message: string } = body;
							throw new Error(error.message);
						}
						switch (variant) {
							case "create": {
								const project: Project = body;
								onSuccess?.(project);
								break;
							}
							case "update": {
								const changelog: Changelog<Project> = body;
								onSuccess?.(changelog);
								break;
							}
						}
					})
					.catch((error: Error) => {
						onError?.(error);
					});
			}}
		>
			<MuiTypography marginLeft={1} variant="h6">{locale.titles[variant]}</MuiTypography>
			<MuiTextField
				autoComplete="new-password"
				autoFocus
				fullWidth
				label={locale.labels.name}
				required
				type="text"
				value={state.value.name}
				variant="outlined"
				onChange={(event: any) => {
					const project: Project = {
						...state.value,
						name: event.target.value
					};
					dispatch({ type: "value.set", payload: project });
				}}
			/>
			<MuiTextField
				autoComplete="new-password"
				fullWidth
				label={locale.labels.description}
				multiline
				rows={3}
				required
				type="text"
				value={state.value.description}
				variant="outlined"
				onChange={(event: any) => {
					const project: Project = {
						...state.value,
						description: event.target.value
					};
					dispatch({ type: "value.set", payload: project });
				}}
			/>
			<MuiStack direction="row-reverse" spacing={1}>
				<MuiButton
					fullWidth={onCancel === undefined}
					type="submit"
					variant="contained"
				>
					{locale.actions[variant]}
				</MuiButton>
				<MuiButton
					hidden={onCancel === undefined}
					variant="text"
					onClick={onCancel}
				>
					{locale.actions.cancel}
				</MuiButton>
			</MuiStack>
		</MuiStack>
	);
}

export type ProjectFormSetup = Setup;
export type ProjectFormState = State;
export type ProjectFormAction = Action;
export type ProjectFormContextValue = ContextValue;
export type ProjectFormProperties = Properties;
export const ProjectForm = Object.assign(Component, {
	Context,
	defaultState,
	reducer,
	setup
});

export default ProjectForm;
