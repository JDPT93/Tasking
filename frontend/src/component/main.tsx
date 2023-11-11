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

import Authorization from "model/user/authorization";
import User from "model/user/user";
import SignUp from "component/user/sign-up";

import SignIn from "component/user/sign-in";
import Wrapper from "component/wrapper";

import userService from "service/user/user-service";

interface State {
  readonly locale: "spanish";
  readonly ready: boolean;
  readonly theme: MuiTheme;
  readonly user: User | null;
}

const initialState: State = {
  locale: "spanish",
  ready: false,
  theme: muiCreateTheme({
    palette: {
      mode: "dark"
    }
  }),
  user: null
};

type Action =
  { type: "locale.change", payload: any } |
  { type: "theme.change", payload: MuiTheme } |
  { type: "user.sign-in", payload: User } |
  { type: "user.sign-out" }
  ;

function reducer(state: State, action: Action): State {
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

const Context = React.createContext<ContextValue>({ state: initialState });

type Properties = {

};

function Component({
}: Properties) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  function refreshToken() {
    const token = userService.getToken();
    if (token?.isAlive()) {
      setTimeout(() => {
        userService.renewToken()
          .then(async (response: Response) => {
            const body: any = await response.json();
            if (!response.ok) {
              throw new Error(body.message);
            }
            const authorization: Authorization = body as Authorization;
            userService.setToken(authorization.token);
            refreshToken();
          })
          .catch((error: Error) => {
            userService.removeToken();
            // dispatch({
            // 	type: "set:main.error",
            // 	payload: error
            // });
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
            throw new Error(body.message);
          }
          const user: User = body as User;
          dispatch({
            type: "user.sign-in",
            payload: user
          });
        })
        .catch((error: Error) => {
          userService.removeToken();
          dispatch({
            type: "user.sign-out"
          });
        });
    } else {
      userService.removeToken();
      return dispatch({
        type: "user.sign-out"
      });
    }
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <MuiThemeProvider theme={state.theme} >
        <MuiCssBaseline />
        <BrowserRouter>
          <Wrapper>
            <Routes>
              <Route index element={state.ready ? <SignIn onSuccess={(authorization: Authorization) => { dispatch({ type: "user.sign-in", payload: authorization.user }) }} /> : null} />
              <Route path="sign-in" element={state.ready ? state.user === null ? <SignIn onSuccess={(authorization: Authorization) => { dispatch({ type: "user.sign-in", payload: authorization.user }) }} /> : null : null} />
              <Route path="sign-up" element={state.ready ? state.user === null ? <SignUp onSuccess={(authorization: Authorization) => { dispatch({ type: "user.sign-in", payload: authorization.user }) }} /> : null : null} />
              {/* <Route path="*" element={<ErrorPage value={404} />} /> */}
            </Routes>
          </Wrapper>
        </BrowserRouter>
      </MuiThemeProvider>
    </Context.Provider>
  );
}

export type MainState = State;
export type MainAction = Action;
export type MainContextValue = ContextValue;
export type MainProperties = Properties;
export const Main = Object.assign(Component, {
  Context,
  initialState,
  reducer,
});

export default Main;
