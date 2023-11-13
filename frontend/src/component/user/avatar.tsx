import React from "react";

import {
	Avatar as MuiAvatar
} from "@mui/material";

import User from "model/user/user";

import ColorUtility from "utility/color-utility";

interface Setup {

}

const setup: Setup = {

};

type Properties = {
	size?: "small" | "medium" | "large"
	value: User
};

function Component({
	size,
	value
}: Properties) {
	const initials: string[] = value.name.trim().split(/\s+/).map(name => name.charAt(0).toLocaleUpperCase());
	return (
		<MuiAvatar
			alt={value.name}
			src={`/user/avatar/${value.id}.jpg`}
			sx={{
				backgroundColor: ColorUtility.textInterpolation(value.name),
				...{
					small: {
						fontSize: 11,
						height: 24,
						width: 24
					},
					medium: {
						height: 40,
						width: 40
					},
					large: {
						height: 56,
						width: 56
					}
				}[size ?? "medium"]
			}}
		>
			{(initials.at(0) ?? "").concat(initials.at(-1) ?? "")}
		</MuiAvatar >
	);
}

export type UserAvatarProperties = Properties;
export const UserAvatar = Object.assign(Component, {
	setup
});

export default UserAvatar;
