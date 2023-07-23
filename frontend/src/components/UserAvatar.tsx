import React from "react";
import { Avatar, Tooltip } from "@mui/material";

import User from "../schemas/User";

interface Properties {
    user: User;
}

export function UserAvatar({ user }: Properties) {
    return <Avatar
        alt={user.name}
        src={`/profiles/${user.id}.jpg`}
        sx={{
            color: "white",
            backgroundColor: (name => {
                let hash = 0;
                for (let index = 0; index < name.length; index++) {
                    hash = ((hash << 5) - hash) ^ name.charCodeAt(index);
                }
                let color = "#";
                for (let index = 0; index < 3; index++) {
                    color += "0".concat(((hash >> (index << 2)) & 0xFF).toString(16)).slice(-2);
                }
                return color;
            })(user.name),
            fontWeight: 500,
            mixBlendMode: "difference"
        }}
    >
        {user.name.trim().split(/\s+/, 2).map(name => name.charAt(0)).join("")}
    </Avatar >
}

export default UserAvatar;