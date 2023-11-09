import React from "react";

import {
	Avatar as MuiAvatar,
	colors as muiColors
} from "@mui/material";

import User from "model/user/user";

import StringUtility from "utility/string-utility";

type Color = {
	[contrast: number]: string
};

type Properties = {
	value: User
};

function Component({
	value
}: Properties) {
	const contrast: number = 500;
	const colors: Color[] = Object.values(muiColors).filter((color: Color) => contrast in color);
	const color: string = colors[Math.abs(StringUtility.hashCode(value.name) % colors.length)][contrast];
	return (
		<MuiAvatar alt={value.name} src={`/user/avatar/${value.id}.jpg`} sx={{ backgroundColor: color }}>
			{value.name.charAt(0)}
		</MuiAvatar>
	);
}

export type UserAvatarProperties = Properties;
export const UserAvatar = Component;

export default UserAvatar;
