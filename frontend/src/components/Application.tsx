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
import Authorization from "../payloads/Authorization";
import User from "../schemas/User";

export default function Application() {
    const [error, setError] = React.useState<Error | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const { userService } = React.useContext(ServiceContext);
    React.useEffect(() => {
        if (userService.getToken()?.isNotExpired()) {
            userService.retrieveMe()
                .then(async response => {
                    const body = await response.json();
                    if (!response.ok) {
                        throw body as Error;
                    }
                    setUser(body as User);
                })
                .catch(setError);
        }
    }, []);
    function test() {
        // setInterval(() => {
        //     userService.authorize()
        //         .then(async response => {

        //         })
        //         .catch(setError);
        // }, 590000);
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
                            <Route index element={user === null
                                ? <SignIn onError={setError} onSuccess={test} to="/" />
                                : <Main><ProjectTable /></Main>
                            } />
                            <Route path="/sign-up" element={<SignUp onError={setError} onSuccess={test} to="/" />} />
                            <Route path="/sign-in" element={<SignIn onError={setError} onSuccess={test} to="/" />} />
                            <Route path="/project">
                                <Route index element={<Main><ProjectTable /></Main>} />
                                <Route path=":id">
                                    <Route index element={<Main><ProjectBoard /></Main>} />
                                    <Route path="board" element={<Main><ProjectBoard /></Main>} />
                                </Route>
                            </Route>
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
