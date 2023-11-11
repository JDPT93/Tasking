import React from "react";

import {
  Link
} from "react-router-dom";

import {
  StickyNote2 as StickyNoteIcon
} from "@mui/icons-material";

import {
  Alert as MuiAlert,
  Avatar as MuiAvatar,
  Box as MuiBox,
  Button as MuiButton,
  Link as MuiLink,
  Paper as MuiPaper,
  Stack as MuiStack,
  TextField as MuiTextField,
  Typography as MuiTypography,
  Snackbar as MuiSnackbar
} from "@mui/material";

import Main from "component/main";
import Authentication, { defaultAuthentication } from "model/user/authentication";
import Authorization from "model/user/authorization";
import userService from "service/user/user-service";

interface State {
  readonly error: Error | null;
  readonly value: Authentication;
}

const initialState: State = {
  error: null,
  value: defaultAuthentication
};

type Action =
  { type: "error.hide" } |
  { type: "error.show", payload: Error } |
  { type: "value.set", payload: Authentication }
  ;

function reducer(state: State, action: Action): State {
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

type Properties = {
  onError?: (error: Error) => void;
  onSuccess?: (value: Authorization) => void;
};

function Component({
  onError,
  onSuccess
}: Properties) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const mainContext = React.useContext(Main.Context);
  const locale: any = require(`locale/${mainContext.state.locale}/user/sign-in.json`);
  const user = mainContext.state.user;
  if (user !== null) {
    // return (<ErrorPage value={403} />);
  }
  return (
    <MuiBox alignItems="center" display="flex" justifyContent="center" minHeight="100vh" padding={4}>
      <MuiPaper component="main" elevation={2} square>
        <MuiStack
          alignItems="center"
          component="form"
          gap={2}
          onSubmit={(event: any) => {
            event.preventDefault();
            userService.signIn(state.value)
              .then(async (response: Response) => {
                const body: any = await response.json();
                if (!response.ok) {
                  throw new Error(body.message);
                }
                const authorization: Authorization = body as Authorization;
                userService.setToken(authorization.token);
                onSuccess?.(authorization);
              })
              .catch((error: Error) => {
                dispatch({ type: "error.show", payload: error });
                onError?.(error);
              });
          }}
          padding={4}
          width={400}
        >
          <MuiAvatar sx={{ backgroundColor: "primary.main" }}>
            <StickyNoteIcon />
          </MuiAvatar>
          <MuiTypography component="h1" variant="h5">{locale.title}</MuiTypography>
          <MuiTextField
            autoComplete="new-password"
            fullWidth
            label={locale.labels.email}
            onChange={(event: any) => {
              const authentication: Authentication = {
                ...state.value,
                email: event.target.value
              };
              dispatch({
                type: "value.set",
                payload: authentication
              });
            }}
            required
            type="text"
            value={state.value.email}
            variant="outlined"
          />
          <MuiTextField
            autoComplete="new-password"
            fullWidth
            label={locale.labels.password}
            onChange={(event: any) => {
              const authentication: Authentication = {
                ...state.value,
                password: event.target.value
              };
              dispatch({
                type: "value.set",
                payload: authentication
              });
            }}
            required
            type="password"
            value={state.value.password}
            variant="outlined"
          />
          <MuiButton fullWidth type="submit" variant="contained">{locale.actions.signIn}</MuiButton>
          <MuiLink component={Link} to="/recovery" variant="body2">{locale.links.canNotSignIn}</MuiLink>
          <MuiLink component={Link} to="/sign-up" variant="body2">{locale.links.doNotHaveAnAccount}</MuiLink>
        </MuiStack>
      </MuiPaper>
      <MuiSnackbar
        autoHideDuration={5000}
        onClose={() => dispatch({ type: "error.hide" })}
        open={state.error !== null}
      >
        <MuiAlert severity="error">{state.error?.message}</MuiAlert>
      </MuiSnackbar>
    </MuiBox>
  );
}

export type SignInState = State;
export type SignInAction = Action;
export type SignInContextValue = ContextValue;
export type SignInProperties = Properties;
export const SignIn = Object.assign(Component, {
  initialState,
  reducer
});

export default SignIn;
