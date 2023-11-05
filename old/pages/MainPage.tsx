import * as React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { blue, cyan } from "@mui/material/colors";

import ErrorContext from "../contexts/ErrorContext";
import ServiceContext from "../contexts/ServiceContext";
import UserContext from "../contexts/UserContext";

import Authorization from "../../model/user/authorization";

import User from "../../model/user/user";

import BoardPage from "./BoardPage";
import ErrorPage from "./ErrorPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import ProjectPage from "./ProjectPage";
import WrapperPage from "./WrapperPage";

export default function MainPage() {
  const [error, setError] = React.useState<Error | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState<boolean>(false);
  const { userService } = React.useContext(ServiceContext);
  function refreshToken() {
    const token = userService.getToken();
    if (token !== null) {
      setTimeout(() => {
        userService.authorize()
          .then(async response => {
            const body = await response.json();
            if (!response.ok) {
              throw body as Error;
            }
            const { token } = body as Authorization;
            userService.setToken(token);
            refreshToken();
          })
          .catch(error => {
            userService.removeToken();
            setError(error);
          });
      }, token.timeLeft() - 1000);
    }
  }
  React.useEffect(() => {
    const token = userService.getToken();
    if (token === null) {
      return setReady(true);
    }
    if (token.isExpired()) {
      userService.removeToken();
      return setReady(true);
    }
    refreshToken();
    userService.retrieveMe()
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
  }, []);
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: "dark",
        primary: blue,
        secondary: cyan
      }
    })}>
      <CssBaseline />
      <ErrorContext.Provider value={{ error, setError }}>
        <UserContext.Provider value={{ user, setUser }}>
          {ready &&
            <BrowserRouter>
              <Routes>
                <Route index element={user === null
                  ? <SignInPage onError={setError} onSuccess={refreshToken} to="/" />
                  : <WrapperPage><ProjectPage /></WrapperPage>
                } />
                <Route path="/sign-up" element={
                  user === null
                    ? <SignUpPage onError={setError} onSuccess={refreshToken} to="/" />
                    : <ErrorPage code={403} />
                } />
                <Route path="/sign-in" element={
                  user === null
                    ? <SignInPage onError={setError} onSuccess={refreshToken} to="/" />
                    : <ErrorPage code={403} />
                } />
                <Route path="/project">
                  <Route index element={
                    user === null
                      ? <ErrorPage code={401} />
                      : <WrapperPage><ProjectPage /></WrapperPage>
                  } />
                  <Route path=":id">
                    <Route index element={user === null
                      ? <ErrorPage code={401} />
                      : <WrapperPage><BoardPage /></WrapperPage>
                    } />
                    <Route path="board" element={user === null
                      ? <ErrorPage code={401} />
                      : <WrapperPage><BoardPage /></WrapperPage>
                    } />
                    <Route path="*" element={<ErrorPage code={404} />} />
                  </Route>
                  <Route path="*" element={<ErrorPage code={404} />} />
                </Route>
                <Route path="*" element={<ErrorPage code={404} />} />
              </Routes>
              <Snackbar onClose={event => setError(null)} open={error !== null} sx={{ width: { xs: 1, md: 320 } }}>
                <Alert severity="error">{error?.message}</Alert>
              </Snackbar>
            </BrowserRouter>}
        </UserContext.Provider>
      </ErrorContext.Provider>
    </ThemeProvider>
  );
}
