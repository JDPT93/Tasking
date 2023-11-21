import React from "react";

import {
	DragHandleSharp,
	KeyboardArrowDownSharp,
	KeyboardArrowUpSharp,
	KeyboardDoubleArrowDownSharp,
	KeyboardDoubleArrowUpSharp
} from "@mui/icons-material";

import {
	amber,
	green,
	red
} from "@mui/material/colors";

import Priority, { PriorityId } from "model/project/goal/priority";

type Properties = {
	value: Priority
};

function Component({
	value
}: Properties) {
	switch (value.id as PriorityId) {
		case PriorityId.HIGHER:
			return <KeyboardDoubleArrowUpSharp sx={{ color: red[500] }} />;
		case PriorityId.HIGH:
			return <KeyboardArrowUpSharp sx={{ color: red[500] }} />;
		case PriorityId.MEDIUM:
			return <DragHandleSharp sx={{ color: amber[500] }} />;
		case PriorityId.LOW:
			return <KeyboardArrowDownSharp sx={{ color: green[500] }} />;
		case PriorityId.LOWER:
			return <KeyboardDoubleArrowDownSharp sx={{ color: green[500] }} />;
	}
}

export type PriorityIconProperties = Properties;
export const PriorityIcon = Component;

export default PriorityIcon;
