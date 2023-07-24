import React from "react";
import { KeyboardDoubleArrowUpSharp, KeyboardArrowDownSharp, KeyboardDoubleArrowDownSharp, KeyboardArrowUpSharp, DragHandleSharp } from "@mui/icons-material";

import { IssuePriority } from "../schemas/Issue";
import { green, orange, red, yellow, blue } from "@mui/material/colors";

interface Properties {
	priority: IssuePriority;
}

export function IssuePriorityIcon({ priority }: Properties) {
	return {
		[IssuePriority.HIGHER]: <KeyboardDoubleArrowUpSharp sx={{ color: red[500] }} />,
		[IssuePriority.HIGH]: <KeyboardArrowUpSharp sx={{ color: orange[500] }} />,
		[IssuePriority.MEDIUM]: <DragHandleSharp sx={{ color: yellow[500] }} />,
		[IssuePriority.LOW]: <KeyboardArrowDownSharp sx={{ color: green[500] }} />,
		[IssuePriority.LOWER]: <KeyboardDoubleArrowDownSharp sx={{ color: blue[500] }} />,
	}[priority];
}

export default IssuePriorityIcon;