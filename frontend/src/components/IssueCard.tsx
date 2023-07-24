import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardActionArea, Card, CardContent, Typography, Box, Stack, Chip, Icon, Tooltip } from "@mui/material";

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
                <Stack alignItems="center" direction="row" gap={1} sx={{ mt: 2 }}>
                    <Tooltip title={`${locale.schemas.issue.properties.type}: ${issue.type.name}`}>
                        <Icon sx={{ color: issue.type.color }}>{issue.type.icon}</Icon>
                    </Tooltip>
                    <Tooltip title={`${locale.enumerations.issuePriority.singular}: ${locale.enumerations.issuePriority.constants[issue.priority.toLowerCase()]}`}>
                        <span><IssuePriorityIcon priority={issue.priority} /></span>
                    </Tooltip>
                    {issue.complexity > 0 &&
                        <Tooltip title={`${locale.schemas.issue.properties.complexity}: ${issue.complexity}`}>
                            <Chip label={issue.complexity} sx={{ fontSIze: 12, height: 24 }} />
                        </Tooltip>}
                    <Box flexGrow={1} />
                    <Tooltip title={`${locale.schemas.issue.properties.assignee}: ${issue.assignee.name}`}>
                        <span><UserAvatar sx={{ width: 32, height: 32, fontSize: 16 }} user={issue.assignee} /></span>
                    </Tooltip>
                </ Stack>
            </CardContent>
        </Card>
    </CardActionArea>)
}

export default IssueCard;