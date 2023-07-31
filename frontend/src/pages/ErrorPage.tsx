import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import { Link, Stack, Typography } from "@mui/material";

import LocaleContext from "../contexts/LocaleContext";

interface Properties {
  code: 401 | 403 | 404;
}

export default function ErrorPage({ code }: Properties) {
  const locale = React.useContext(LocaleContext);
  return (
    <Stack alignItems="center" gap={2} justifyContent="center" minHeight="100vh" padding={4}>
      <Typography variant="h1">{locale.pages.error.title} {code}</Typography>
      <Typography variant="body1">{locale.pages.error[code]}</Typography>
      <Link component={RouterLink} to="/" variant="body2">{locale.actions.back}</Link>
    </Stack>
  );
}