import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardActionArea, Card, CardContent, Typography, Box, Stack, Chip, Icon } from "@mui/material";

import Issue from "../schemas/Issue";
import IssuePriorityIcon from "./IssuePriorityIcon"
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
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Icon children="task" color="primary" />
                    <IssuePriorityIcon priority={issue.priority} />
                    {issue.complexity > 0 && <Chip sx={{ width: 24, height: 24 }} label={issue.complexity} />}
                    <Box flexGrow={1} />
                    <UserAvatar sx={{ width: 24, height: 24, fontSize: 12 }} user={issue.assignee} />
                </ Stack>
            </CardContent>
        </Card>
    </CardActionArea>)
}

export default IssueCard;