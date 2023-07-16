import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { amber, yellow } from "@mui/material/colors";

import SignIn from "./SignIn";
import Main from "./Main";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import User from "../schemas/User";
import DialogForm from "./DialogForm";
import SignUp from "./SignUp";
import ProjectTable from "./ProjectTable";

export default function Application() {
    const [error, setError] = React.useState<Error | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    return (
        <ThemeProvider theme={createTheme({
            palette: {
                mode: "dark",
                primary: amber,
                secondary: yellow
            }
        })}>
            <ErrorContext.Provider value={{ error, setError }}>
                <UserContext.Provider value={{ user, setUser }}>
                    <CssBaseline />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={user === null
                                ? <SignIn onError={setError} />
                                : <Main><ProjectTable /></Main>
                            } />
                            <Route path="/sign-up" element={<SignUp onError={setError} to="/" />} />
                            <Route path="/sign-in" element={<SignIn onError={setError} to="/" />} />
                            <Route path="/project" element={<Main><ProjectTable /></Main>} />
                            <Route path="/project/:id" element={<Main>¡Hola, Mundo!</Main>} />
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
