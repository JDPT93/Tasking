import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardActionArea, Card, Link, Avatar, Stack } from "@mui/material";

import Issue from "../schemas/Issue";

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
    console.log(issue);

    return (<CardActionArea onAuxClick={event => {
        event.preventDefault()
    }}>
        <Card>
            <Link component={RouterLink} underline="none" variant="body2" to="#">{ issue.name }</Link>
            <Stack px={1}  direction="row" alignItems="center" justifyContent="space-between">
                <Stack>

                </Stack>
                <Stack>
                    <Avatar {...stringAvatar(issue.assignee.fullname)} src="#" />
                </Stack>
            </Stack>
        </Card>
    </CardActionArea>)
}

export default IssueCard;