import React from "react";
import { Icon } from "@mui/material";

import User from "../schemas/User";
import ColorUtils from "../utils/ColorUtils";
import StringUtils from "../utils/StringUtils";
import IssueType from "../schemas/IssueType";

interface Properties {
	issue: IssueType;
}

export function IssuePriorityIcon({ issue }: Properties) {
	return <Icon />
}

export default IssuePriorityIcon;