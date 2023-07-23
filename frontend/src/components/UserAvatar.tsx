import React from "react";
import { Avatar } from "@mui/material";

import User from "../schemas/User";
import ColorUtils from "../utils/ColorUtils";
import StringUtils from "../utils/StringUtils";

interface Properties {
    user: User;
}

export function UserAvatar({ user }: Properties) {
    return <Avatar
        alt={user.name}
        src={`/profiles/${user.id}.jpg`}
        sx={{
            color: "white",
            backgroundColor: ColorUtils.fromString(user.name),
            fontWeight: 500,
            mixBlendMode: "difference"
        }}
    >
        {StringUtils.initialism(user.name)}
    </Avatar>
}

export default UserAvatar;