import * as React from "react";

import ReactDOM from "react-dom/client";

import MainPage from "./pages/MainPage";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MainPage />
    </React.StrictMode>
);
