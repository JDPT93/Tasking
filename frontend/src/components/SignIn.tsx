import * as React from "react";
import { Link as RouterLink, redirect, useNavigate } from "react-router-dom";
import { Avatar, Button, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { StickyNote2 as StickyNoteIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import Authorization from "../payloads/Authorization";

interface Properties {
    onSignIn?: (payload: Authorization) => string | null;
}

export default function SignIn({ onSignIn }: Properties) {
    const navigate = useNavigate();
    const locale = React.useContext(LocaleContext);
    const { userService } = React.useContext(ServiceContext);
    const { setError } = React.useContext(ErrorContext);
    const { setUser } = React.useContext(UserContext);
    return (
        <Paper component="main" elevation={2} sx={{ maxWidth: 380, p: 4, m: "20vh auto" }} square>
            <Stack alignItems="center" component="form" gap={2} onSubmit={event => {
                event.preventDefault();
                const { emailField, passwordField } = event.target as HTMLFormElement;
                userService.signIn({
                    email: emailField.value,
                    password: passwordField.value
                })
                    .then(async response => {
                        const body = await response.json();
                        if (!response.ok) {
                            throw body as Error;
                        }
                        const authorization = body as Authorization;
                        localStorage.setItem("token", authorization.token);
                        setUser(authorization.user);
                        if (onSignIn != null) {
                            const path = onSignIn(authorization);
                            if (path != null) {
                                navigate(path);
                            }
                        }
                    })
                    .catch(setError);
            }}>
                <Avatar sx={{ backgroundColor: "primary.main" }}>
                    <StickyNoteIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{locale.application.name}</Typography>
                <TextField defaultValue="josedanielpereztorres@gmail.com" fullWidth label={locale.schemas.user.properties.email} name="emailField" required type="email" variant="outlined" />
                <TextField defaultValue="1234567890" autoComplete="current-password" fullWidth label={locale.schemas.user.properties.password} name="passwordField" required type="password" variant="outlined" />
                <Button fullWidth type="submit" variant="contained">{locale.actions.signIn}</Button>
                <Link component={RouterLink} to="" variant="body2">{locale.components.signIn.forgotPassword}</Link>
                <Link component={RouterLink} to="sign-up" variant="body2">{locale.components.signIn.doNotHaveAnAccount}</Link>
                <Link component={RouterLink} to="recovery" variant="body2">{locale.components.signIn.canNotSignIn}</Link>
            </Stack>
        </Paper>
    );
}
