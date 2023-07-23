import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardActionArea, Card, Link, CardContent, Typography, Avatar, Tooltip } from "@mui/material";

import Issue from "../schemas/Issue";
import UserAvatar from "./UserAvatar";
import LocaleContext from "../contexts/LocaleContext";

interface Properties {
    issue: Issue;
}

const stringToColor = (string: string) => {
    let hash = 0, i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

const stringAvatar = (name: string) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

export function IssueCard({ issue }: Properties) {
    const locale = React.useContext(LocaleContext);
    return (<CardActionArea onAuxClick={event => {
        event.preventDefault()
    }}>
        <Card>
            <CardContent>
                <Typography fontWeight={500} variant="body1">{issue.name}</Typography>
                <Typography color="text.secondary" variant="body2">{issue.description}</Typography>
                <UserAvatar user={issue.assignee} />
            </CardContent>
        </Card>
    </CardActionArea>)
}

export default IssueCard;