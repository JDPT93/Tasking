import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { blue, cyan } from "@mui/material/colors";

import ProjectBoard from "./ProjectBoard";
import Main from "./Main";
import ProjectTable from "./ProjectTable";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ServiceContext from "../contexts/ServiceContext";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import User from "../schemas/User";
import Authorization from "../payloads/Authorization";

export default function Application() {
    const { userService } = React.useContext(ServiceContext);
    const [error, setError] = React.useState<Error | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [ready, setReady] = React.useState<boolean>(false);
    function startTokenRenewer() {
        setInterval(() => {
            userService.authorize()
                .then(async response => {
                    const body = await response.json();
                    if (!response.ok) {
                        throw body as Error;
                    }
                    const { token } = body as Authorization;
                    userService.setToken(token);
                })
                .catch(error => {
                    userService.removeToken();
                    setError(error);
                });
        }, userService.getToken()!.timeLeft());
    }
    React.useEffect(() => {
        const token = userService.getToken();
        if (token?.isAlive()) {
            startTokenRenewer();
            userService.retrieveMyself()
                .then(async response => {
                    const body = await response.json();
                    if (!response.ok) {
                        throw body as Error;
                    }
                    setUser(body as User);
                    setReady(true);
                })
                .catch(error => {
                    userService.removeToken();
                    setReady(true);
                });
        } else {
            userService.removeToken();
            setReady(true);
        }
    }, []);
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
                    {ready &&
                        <BrowserRouter>
                            <CssBaseline />
                            <Routes>
                                <Route index element={user === null
                                    ? <SignIn onError={setError} onSuccess={startTokenRenewer} to="/" />
                                    : <Main><ProjectTable /></Main>
                                } />
                                <Route path="/sign-up" element={<SignUp onError={setError} onSuccess={startTokenRenewer} to="/" />} />
                                <Route path="/sign-in" element={<SignIn onError={setError} onSuccess={startTokenRenewer} to="/" />} />
                                <Route path="/project">
                                    <Route index element={<Main><ProjectTable /></Main>} />
                                    <Route path=":id">
                                        <Route index element={<Main><ProjectBoard /></Main>} />
                                        <Route path="board" element={<Main><ProjectBoard /></Main>} />
                                    </Route>
                                </Route>
                            </Routes>
                            <Snackbar
                                autoHideDuration={10000}
                                onClose={event => setError(null)}
                                open={error !== null}
                                sx={{ width: { xs: 1, md: 320 } }}
                            >
                                <Alert severity="error">{error?.message}</Alert>
                            </Snackbar>
                        </BrowserRouter>}
                </UserContext.Provider>
            </ErrorContext.Provider>
        </ThemeProvider>
    );
}
