import React from "react";

import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";

import {
	CssBaseline as MuiCssBaseline,
	createTheme as muiCreateTheme,
	ThemeProvider as MuiThemeProvider,
	Theme as MuiTheme
} from "@mui/material";

import {
	blue
} from "@mui/material/colors";

import ProjectBoard from "component/project/board";
import ProjectIndex from "component/project/index";
import SignUp from "component/user/sign-up";
import SignIn from "component/user/sign-in";
import Wrapper from "component/wrapper";

import User from "model/user/user";
import Authorization from "model/user/authorization";

import userService from "service/user/user-service";
import ProjectBacklog from "./project/backlog";

type Locale = "spanish";

type Theme = "dark" | "light";

interface State {
	readonly locale: Locale;
	readonly ready: boolean;
	readonly theme: Theme;
	readonly user: User | null;
}

export const defaultState: State = {
	locale: "spanish",
	ready: false,
	theme: "dark",
	user: null
};

type Action =
	{ type: "locale.change", payload: Locale } |
	{ type: "theme.change", payload: Theme } |
	{ type: "user.sign-in", payload: User } |
	{ type: "user.sign-out" }
	;

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "locale.change": {
			return {
				...state,
				locale: action.payload
			};
		}
		case "theme.change": {
			return {
				...state,
				theme: action.payload
			};
		}
		case "user.sign-in": {
			return {
				...state,
				user: action.payload,
				ready: true
			};
		}
		case "user.sign-out": {
			return {
				...state,
				user: null,
				ready: true
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
	onError?: (error: Error) => void
};

function Component({
	onError
}: Properties) {
	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const refreshToken: () => void = () => {
		const token = userService.getToken();
		if (token?.isAlive()) {
			setTimeout(() => {
				userService.renewToken()
					.then(async (response: Response) => {
						const body: any = await response.json();
						if (!response.ok) {
							const error: { message: string } = body;
							throw new Error(error.message);
						}
						const authorization: Authorization = body;
						userService.setToken(authorization.token);
						refreshToken();
					})
					.catch((error: Error) => {
						userService.removeToken();
						onError?.(error);
					});
			}, token.timeLeft() - 1000);
		}
	}
	React.useEffect(() => {
		const token = userService.getToken();
		if (token?.isAlive()) {
			refreshToken();
			userService.whoAmI()
				.then(async (response: Response) => {
					const body: any = await response.json();
					if (!response.ok) {
						const error: { message: string } = body;
						throw new Error(error.message);
					}
					const user: User = body;
					dispatch({ type: "user.sign-in", payload: user });
				})
				.catch((error: Error) => {
					userService.removeToken();
					dispatch({ type: "user.sign-out" });
				});
		} else {
			userService.removeToken();
			return dispatch({ type: "user.sign-out" });
		}
	}, []);
	return (
		<Context.Provider value={{ state, dispatch }}>
			<MuiThemeProvider
				theme={muiCreateTheme({
					palette: {
						mode: state.theme,
						primary: blue
					}
				})}
			>
				<MuiCssBaseline />
				<BrowserRouter>
					<Wrapper>
						<Routes>
							<Route index element={
								state.ready
									? state.user === null
										?
										<SignIn
											value={{
												email: "josedanielpereztorres@gmail.com",
												password: "1234567890"
											}}
											onSuccess={(authorization: Authorization) => dispatch({
												type: "user.sign-in",
												payload: authorization.user
											})}
										/>
										: <ProjectIndex />
									: null
							} />
							<Route path="sign-in">
								<Route index element={
									state.ready
										? state.user === null
											?
											<SignIn
												onSuccess={(authorization: Authorization) => dispatch({
													type: "user.sign-in",
													payload: authorization.user
												})}
											/>
											: null
										: null
								} />
							</Route>
							<Route path="sign-up">
								<Route index element={
									state.ready
										? state.user === null
											?
											<SignUp
												onSuccess={(authorization: Authorization) => dispatch({
													type: "user.sign-in",
													payload: authorization.user
												})}
											/>
											: null
										: null
								} />
							</Route>
							<Route path="project">
								<Route index element={
									state.ready
										? state.user === null
											? null
											: <ProjectIndex />
										: null
								} />
								<Route path=":projectId">
									<Route index element={
										state.ready
											? state.user === null
												? null
												: <ProjectBoard />
											: null
									} />
									<Route path="backlog">
										<Route index element={
											state.ready
												? state.user === null
													? null
													: <ProjectBacklog />
												: null
										} />
									</Route>
									<Route path="board">
										<Route index element={
											state.ready
												? state.user === null
													? null
													: <ProjectBoard />
												: null
										} />
									</Route>
								</Route>
							</Route>
						</Routes>
					</Wrapper>
				</BrowserRouter>
			</MuiThemeProvider>
		</Context.Provider>
	);
}

export type MainContextValue = ContextValue;
export type MainProperties = Properties;

export const Main = Component;
export const MainContext = Context;

export default Main;
