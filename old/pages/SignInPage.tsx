import * as React from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { StickyNote2 as StickyNoteIcon } from "@mui/icons-material";
import { Avatar, Box, Button, Link, Paper, Stack, TextField, Typography } from "@mui/material";

import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import UserContext from "../contexts/UserContext";

import Authentication from "../../model/user/authentication";
import Authorization from "../../model/user/authorization";

interface Properties {
  onError?: (error: Error) => void;
  onSuccess?: (object: Authorization) => void;
  to?: string;
}

export default function SignInPage({ onError, onSuccess, to }: Properties) {
  const navigate = useNavigate();
  const locale = React.useContext(LocaleContext);
  const { userService } = React.useContext(ServiceContext);
  const { setUser } = React.useContext(UserContext);
  return (
    <Box alignItems="center" display="flex" justifyContent="center" minHeight="100vh" padding={4}>
      <Paper component="main" elevation={2} square>
        <Stack alignItems="center" component="form" gap={2} padding={4} width={400} onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.target as HTMLFormElement);
          userService.authenticate({
            email: data.get("email"),
            password: data.get("password")
          } as Authentication)
            .then(async response => {
              const body = await response.json();
              if (!response.ok) {
                throw body as Error;
              }
              const authorization = body as Authorization;
              userService.setToken(authorization.token);
              setUser(authorization.user);
              if (onSuccess !== undefined) {
                onSuccess(authorization);
              }
              if (to !== undefined) {
                navigate(to);
              }
            })
            .catch(error => {
              if (onError !== undefined) {
                onError(error);
              }
            });
        }}>
          <Avatar sx={{ backgroundColor: "primary.main" }}>
            <StickyNoteIcon />
          </Avatar>
          <Typography component="h1" variant="h5">{locale.application.name}</Typography>
          <TextField defaultValue="josedanielpereztorres@gmail.com" fullWidth label={locale.schemas.user.properties.email} name="email" required type="email" variant="outlined" />
          <TextField defaultValue="Az1234567890*" autoComplete="current-password" fullWidth label={locale.schemas.user.properties.password} name="password" required type="password" variant="outlined" />
          <Button fullWidth type="submit" variant="contained">{locale.actions.signIn}</Button>
          <Link component={RouterLink} to="/recovery" variant="body2">{locale.pages.signIn.canNotSignIn}</Link>
          <Link component={RouterLink} to="/sign-up" variant="body2">{locale.pages.signIn.doNotHaveAnAccount}</Link>
        </Stack>
      </Paper>
    </Box>
  );
}
