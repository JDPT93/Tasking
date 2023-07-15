import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import { Alert, Avatar, Button, Link, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { StickyNote2 as StickyNoteIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import UserContext from "../contexts/UserContext";
import ServiceContext from "../contexts/ServiceContext";

import Authorization from "../payloads/Authorization";
import ErrorContext from "../contexts/ErrorContext";

export default function Authentication() {
    const locale = React.useContext(LocaleContext);
    const { userService } = React.useContext(ServiceContext);
    const { setError } = React.useContext(ErrorContext);
    const { setUser } = React.useContext(UserContext);
    return (
        <Paper component="main" elevation={2} sx={{ maxWidth: 380, padding: 4 }} square>
            <Stack alignItems="center" component="form" gap={2} onSubmit={event => {
                event.preventDefault();
                const { emailField, passwordField } = event.target as HTMLFormElement;
                userService.signIn({
                    email: emailField.value,
                    password: passwordField.value
                })
                    .then(async response => {
                        const body = await response.json();
                        if (!response.ok)
                            throw body as Error;
                        const { user, token } = body as Authorization;
                        setUser(user);
                        localStorage.setItem("token", token);
                    })
                    .catch(setError);
            }}>
                <Avatar sx={{ backgroundColor: "primary.main" }}>
                    <StickyNoteIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{locale.application.name}</Typography>
                <TextField fullWidth label={locale.schemas.user.properties.email} name="emailField" required type="email" variant="outlined" />
                <TextField autoComplete="current-password" fullWidth label={locale.schemas.user.properties.password} name="passwordField" required type="password" variant="outlined" />
                <Button fullWidth type="submit" variant="contained">{locale.actions.signIn}</Button>
                <Link component={RouterLink} to="#" variant="body2">{locale.questions.forgotPassword}</Link>
            </Stack>
        </Paper>
    );
}
