import React from "react";

import {
    Box as MuiBox
} from "@mui/material";

interface State {

}

const initialState: State = {

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

type Properties = {

};

function Component({

}: Properties) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <MuiBox>

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
