import * as React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Alert, CssBaseline, Snackbar } from "@mui/material";

import Authentication from "./Authentication";
import Main from "./Main";

import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";

import User from "../schemas/User";

export default function Application() {
    const [error, setError] = React.useState<Error | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    return (
        <ErrorContext.Provider value={{ error, setError }}>
            <UserContext.Provider value={{ user, setUser }}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                user == null
                                    ? <Authentication />
                                    : <Main />
                            }
                        />
                    </Routes>
                </BrowserRouter>
                <Snackbar
                    autoHideDuration={5000}
                    onClose={() => setError(null)}
                    open={error != null}
                    sx={{ width: { xs: 1, md: 320 } }}
                >
                    <Alert severity="error">{error?.message}</Alert>
                </Snackbar>
            </UserContext.Provider>
        </ErrorContext.Provider>
    );
}
