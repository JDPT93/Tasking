import React from "react";
import { Avatar, AvatarProps } from "@mui/material";

import User from "../schemas/User";
import ColorUtils from "../utils/ColorUtils";
import StringUtils from "../utils/StringUtils";

interface Properties extends AvatarProps {
    user: User;
}

export function UserAvatar({ user, ...inherit }: Properties) {
    return <Avatar
        alt={user.name}
        src={`/profiles/${user.id}.jpg`}
        {...inherit}
        sx={{
            color: "white",
            backgroundColor: ColorUtils.fromString(user.name),
            fontWeight: 500,
            mixBlendMode: "difference",
            ...inherit.sx
        }}
    >
        {StringUtils.initialism(user.name, 2)}
    </Avatar >
}

export default UserAvatar;