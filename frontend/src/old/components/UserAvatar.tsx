import React from "react";

import { Avatar, AvatarProps } from "@mui/material";

import User from "../../model/user/user";

import ColorUtils from "../utils/ColorUtils";
import StringUtils from "../utils/StringUtils";

interface Properties extends AvatarProps {
  user: User;
}

export function UserAvatar({ user, ...inherit }: Properties) {
  const backgroundColor = ColorUtils.fromString(user.name);
  const color = ColorUtils.getForeground(backgroundColor);
  return (
    <Avatar
      alt={user.name}
      src={`/profiles/${user.id}.jpg`}
      {...inherit}
      sx={{
        color,
        backgroundColor,
        fontWeight: 500,
        ...inherit.sx
      }}>
      {StringUtils.initialism(user.name, 2)}
    </Avatar>
  );
}

export default UserAvatar;