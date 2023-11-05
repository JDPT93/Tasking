import React from "react";

import { KeyboardDoubleArrowUpSharp, KeyboardArrowDownSharp, KeyboardDoubleArrowDownSharp, KeyboardArrowUpSharp, DragHandleSharp } from "@mui/icons-material";
import { red, amber, green } from "@mui/material/colors";

import LocaleContext from "../contexts/LocaleContext";

import { IssuePriority } from "../schemas/Issue";

interface Properties {
  priority: IssuePriority;
}

export function IssuePriorityIcon({ priority }: Properties) {
  const locale = React.useContext(LocaleContext);
  switch (priority) {
    case IssuePriority.HIGHER:
      return <KeyboardDoubleArrowUpSharp sx={{ color: red[500] }} />;
    case IssuePriority.HIGH:
      return <KeyboardArrowUpSharp sx={{ color: red[500] }} />;
    case IssuePriority.MEDIUM:
      return <DragHandleSharp sx={{ color: amber[500] }} />;
    case IssuePriority.LOW:
      return <KeyboardArrowDownSharp sx={{ color: green[500] }} />;
    case IssuePriority.LOWER:
      return <KeyboardDoubleArrowDownSharp sx={{ color: green[500] }} />;
  }
}

export default IssuePriorityIcon;