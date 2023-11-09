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

import Main from "component/main";

import Authorization from "model/user/authorization";
import User, { defaultUser } from "model/user/user";

import userService from "service/user/user-service";

interface State {
  readonly error: Error | null;
  readonly value: User;
}

const initialState: State = {
  error: null,
  value: defaultUser
};

type Action =
  { type: "error.hide" } |
  { type: "error.show", payload: Error } |
  { type: "value.set", payload: User }
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
          padding={4}
          width={400}
          onSubmit={event => {
            event.preventDefault();
            userService.signUp(state.value)
              .then(async (response: Response) => {
                const body = await response.json();
                if (!response.ok) {
                  throw body as Error;
                }
                const authorization: Authorization = body as Authorization;
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
          <MuiTypography component="h1" variant="h5">{locale.application.name}</MuiTypography>
          <MuiTextField fullWidth label={locale.schemas.user.properties.name} name="name" required type="text" variant="outlined" />
          <MuiTextField fullWidth label={locale.schemas.user.properties.email} name="email" required type="email" variant="outlined" />
          <MuiTextField autoComplete="current-password" fullWidth label={locale.schemas.user.properties.password} name="password" required type="password" variant="outlined" />
          <MuiButton fullWidth type="submit" variant="contained">{locale.actions.signUp}</MuiButton>
          <MuiLink component={Link} to="/sign-in" variant="body2">{locale.actions.signIn}</MuiLink>
        </MuiStack>
      </MuiPaper>
    </MuiBox>
  );
}

export type SignUpState = State;
export type SignUpAction = Action;
export type SignUpContextValue = ContextValue;
export type SignUpProperties = Properties;
export const SignUp = Object.assign(Component, {
  initialState,
  reducer
});

export default SignUp;
