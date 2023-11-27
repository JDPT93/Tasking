import React from "react";

import {
	Link
} from "react-router-dom";

import {
	StickyNote2 as StickyNoteIcon
} from "@mui/icons-material";

import {
	Button as MuiButton,
	Avatar as MuiAvatar,
	Box as MuiBox,
	Link as MuiLink,
	Paper as MuiPaper,
	Stack as MuiStack,
	TextField as MuiTextField,
	Typography as MuiTypography
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";

import Authorization from "model/user/authorization";
import User, { defaultUser } from "model/user/user";

import userService from "service/user/user-service";

interface State {
	readonly error: Error | null;
	readonly value: User;
}

export const defaultState: State = {
	error: null,
	value: defaultUser
};

type Action =
	{ type: "error.hide" } |
	{ type: "error.show", payload: Error } |
	{ type: "value.set", payload: User }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "error.hide": {
			return {
				...state,
				error: null
			};
		}
		case "error.show": {
			return {
				...state,
				error: action.payload
			};
		}
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
	onError?: (error: Error) => void;
	onSuccess?: (value: Authorization) => void;
};

function Component({
	onError,
	onSuccess
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/user/sign-up.json`);
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	return (
		<MuiBox alignItems="center" display="flex" justifyContent="center" minHeight="100vh" padding={4}>
			<MuiPaper component="main" elevation={2} square>
				<MuiStack
					alignItems="center"
					component="form"
					gap={2}
					padding={4}
					width={400}
					onSubmit={event => {
						event.preventDefault();
						userService.signUp(state.value)
							.then(async (response: Response) => {
								const body: any = await response.json();
								if (!response.ok) {
									const error: { message: string } = body;
									throw new Error(error.message);
								}
								const authorization: Authorization = body;
								userService.setToken(authorization.token);
								onSuccess?.(authorization);
							})
							.catch((error: Error) => {
								onError?.(error);
							});
					}}>
					<MuiAvatar sx={{ backgroundColor: "primary.main" }}>
						<StickyNoteIcon />
					</MuiAvatar>
					<MuiTypography component="h1" variant="h5">{locale.title}</MuiTypography>
					<MuiTextField fullWidth label={locale.labels.name} name="name" required type="text" variant="outlined" />
					<MuiTextField fullWidth label={locale.labels.email} name="email" required type="email" variant="outlined" />
					<MuiTextField autoComplete="current-password" fullWidth label={locale.labels.password} name="password" required type="password" variant="outlined" />
					<MuiButton fullWidth type="submit" variant="contained">{locale.actions.signUp}</MuiButton>
					<MuiLink component={Link} to="/sign-in" variant="body2">{locale.actions.signIn}</MuiLink>
				</MuiStack>
			</MuiPaper>
		</MuiBox>
	);
}

export type SignUpContextValue = ContextValue;
export type SignUpProperties = Properties;

export const SignUp = Component;
export const SignUpContext = Context;

export default SignUp;
