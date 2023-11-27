import React from "react";

import {
	Button as MuiButton,
	Stack as MuiStack,
	TextField as MuiTextField,
	Typography as MuiTypography
} from "@mui/material"

import Changelog from "model/common/changelog";
import { MainContext, MainContextValue } from "component/main";
import Iteration, { defaultIteration } from "model/project/iteration";
import Project from "model/project/project";

import iterationService from "service/project/iteration-service";

interface State {
	value: Iteration;
}

export const defaultState: State = {
	value: defaultIteration
};

type Action =
	{ type: "value.set", payload: Iteration }
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
	value?: Iteration,
	variant: "create",
	onSuccess?: (value: Iteration) => void
} | {
	project?: undefined,
	value: Iteration,
	variant: "update",
	onSuccess?: (changelog: Changelog<Iteration>) => void
});

function Component({
	project,
	value,
	variant,
	onCancel,
	onError,
	onSuccess
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/iteration/form.json`);
	const initialState: State = {
		...defaultState,
		...(value !== undefined && {
			value: {
				...value,
				...(project !== undefined && { project })
			}
		})
	};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiStack
				component="form"
				spacing={2}
				width={400}
				onSubmit={(event: any) => {
					event.preventDefault();
					iterationService[variant](state.value)
						.then(async (response: Response) => {
							const body: any = await response.json();
							if (!response.ok) {
								const error: { message: string } = body;
								throw new Error(error.message);
							}
							switch (variant) {
								case "create": {
									const iteration: Iteration = body;
									onSuccess?.(iteration);
									break;
								}
								case "update": {
									const changelog: Changelog<Iteration> = body;
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
						const iteration: Iteration = {
							...state.value,
							name: event.target.value
						};
						dispatch({ type: "value.set", payload: iteration });
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
						const iteration: Iteration = {
							...state.value,
							description: event.target.value
						};
						dispatch({ type: "value.set", payload: iteration });
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
		</Context.Provider>
	);
}

export type IterationFormContextValue = ContextValue;
export type IterationFormProperties = Properties;

export const IterationForm = Component;
export const IterationFormContext = Context;

export default IterationForm;
