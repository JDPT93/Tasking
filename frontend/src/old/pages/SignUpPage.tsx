import * as React from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { StickyNote2 as StickyNoteIcon } from "@mui/icons-material";
import { Avatar, Box, Button, Link, Paper, Stack, TextField, Typography } from "@mui/material";

import LocaleContext from "../contexts/LocaleContext";
import ServiceContext from "../contexts/ServiceContext";
import UserContext from "../contexts/UserContext";

import Authorization from "../../model/user/authorization";

import User from "../../model/user/user";

interface Properties {
  onError?: (error: Error) => void;
  onSuccess?: (object: Authorization) => void;
  to?: string;
}

export default function SignUpPage({ onError, onSuccess, to }: Properties) {
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
          userService.create({
            name: data.get("name"),
            email: data.get("email"),
            password: data.get("password")
          } as User)
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
          <TextField fullWidth label={locale.schemas.user.properties.name} name="name" required type="text" variant="outlined" />
          <TextField fullWidth label={locale.schemas.user.properties.email} name="email" required type="email" variant="outlined" />
          <TextField autoComplete="current-password" fullWidth label={locale.schemas.user.properties.password} name="password" required type="password" variant="outlined" />
          <Button fullWidth type="submit" variant="contained">{locale.actions.signUp}</Button>
          <Link component={RouterLink} to="/sign-in" variant="body2">{locale.actions.signIn}</Link>
        </Stack>
      </Paper>
    </Box>
  );
}
