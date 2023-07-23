import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardActionArea, Card, Link, CardContent, Typography, Avatar, Tooltip } from "@mui/material";

import Issue from "../schemas/Issue";
import UserAvatar from "./UserAvatar";
import LocaleContext from "../contexts/LocaleContext";

interface Properties {
    issue: Issue;
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