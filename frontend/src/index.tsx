import * as React from "react";
import ReactDOM from "react-dom/client";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Application from "./components/Application";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>
);