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

import Priority from "model/project/goal/priority";

interface Setup {

}

const setup: Setup = {

};

type Properties = {
	value: Priority
};

function Component({
	value
}: Properties) {
	switch (value.id) {
		case 1:
			return <KeyboardDoubleArrowUpSharp sx={{ color: red[500] }} />;
		case 2:
			return <KeyboardArrowUpSharp sx={{ color: red[500] }} />;
		case 3:
			return <DragHandleSharp sx={{ color: amber[500] }} />;
		case 4:
			return <KeyboardArrowDownSharp sx={{ color: green[500] }} />;
		case 5:
			return <KeyboardDoubleArrowDownSharp sx={{ color: green[500] }} />;
		default:
			return <></>;
	}
}

export type PriorityIconSetup = Setup;
export type PriorityIconProperties = Properties;
export const PriorityIcon = Object.assign(Component, {
	setup
});

export default PriorityIcon;
