import React from "react";

import {
	Button as MuiButton,
	Stack as MuiStack,
	TextField as MuiTextField,
	Typography as MuiTypography
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";

import Changelog from "model/common/changelog";
import Stage, { defaultStage } from "model/project/goal/stage/stage";
import Project from "model/project/project";

import stageService from "service/project/goal/stage/stage-service";

interface State {
	readonly value: Stage;
}

export const defaultState: State = {
	value: defaultStage
};

type Action =
	{ type: "value.set", payload: Stage }
	;

export function reducer(state: State, action: Action): State {
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
	project: Project,
	value?: Stage,
	variant: "create",
	onSuccess?: (value: Stage) => void
} | {
	value: Stage,
	variant: "update",
	onSuccess?: (changelog: Changelog<Stage>) => void
});

function Component({
	value,
	variant,
	onCancel,
	onError,
	onSuccess
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/form.json`);
	const initialState: State = {
		...defaultState,
		...(value !== undefined && { value })
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<MuiStack
			component="form"
			spacing={2}
			width={400}
			onSubmit={(event: any) => {
				event.preventDefault();
				stageService[variant](state.value)
					.then(async (response: Response) => {
						const body: any = await response.json();
						if (!response.ok) {
							const error: { message: string } = body;
							throw new Error(error.message);
						}
						switch (variant) {
							case "create": {
								const project: Stage = body;
								onSuccess?.(project);
								break;
							}
							case "update": {
								const changelog: Changelog<Stage> = body;
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
					const project: Stage = {
						...state.value,
						name: event.target.value
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

export type StageFormContextValue = ContextValue;
export type StageFormProperties = Properties;

export const StageForm = Component;
export const StageFormContext = Context;

export default StageForm;
