import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { amber, blue, cyan, yellow } from "@mui/material/colors";

import SignIn from "./SignIn";
import Main from "./Main";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import User from "../schemas/User";
import DialogForm from "./DialogForm";
import SignUp from "./SignUp";
import ProjectTable from "./ProjectTable";
import ServiceContext from "../contexts/ServiceContext";
import Authorization from "../payloads/Authorization";

import Board from "./Board";

export default function Application() {
    const { userService } = React.useContext(ServiceContext);
    const [error, setError] = React.useState<Error | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    function test() {
        setInterval(() => {
            userService.authorize()
                .then(async response => {
                    const body = await response.json();
                    if (!response.ok) {
                        throw body as Error;
                    }
                    const authorization = body as Authorization;
                    localStorage.setItem("token", authorization.token);
                    setUser(authorization.user);
                })
                .catch(setError);
        }, 590000);
    }
    return (
        <ThemeProvider theme={createTheme({
            palette: {
                mode: "dark",
                primary: blue,
                secondary: cyan
            }
        })}>
            <ErrorContext.Provider value={{ error, setError }}>
                <UserContext.Provider value={{ user, setUser }}>
                    <CssBaseline />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={user === null
                                ? <SignIn onError={setError} onSuccess={test} to="/" />
                                : <Main><ProjectTable /></Main>
                            } />
                            <Route path="/sign-up" element={<SignUp onError={setError} onSuccess={test} to="/" />} />
                            <Route path="/sign-in" element={<SignIn onError={setError} onSuccess={test} to="/" />} />
                            <Route path="/project" element={<Main><ProjectTable /></Main>} />
                            <Route path="/project/:id" element={<Main ><Board></Board></Main>} />
                            <Route path="/project/:id/board" element={<Main ><Board></Board></Main>} />
                            <Route path="/project-form" element={<DialogForm open={true} />} />
                        </Routes>
                    </BrowserRouter>
                    <Snackbar
                        autoHideDuration={5000}
                        onClose={event => setError(null)}
                        open={error !== null}
                        sx={{ width: { xs: 1, md: 320 } }}
                    >
                        <Alert severity="error">{error?.message}</Alert>
                    </Snackbar>
                </UserContext.Provider>
            </ErrorContext.Provider>
        </ThemeProvider>
    );
}
