import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardActionArea, Card, Link } from "@mui/material";

import Issue from "../schemas/Issue";

interface Properties {
    issue: Issue;
}

export function IssueCard({ issue }: Properties) {
    return (<CardActionArea onAuxClick={event => {
        event.preventDefault()
    }}>
        <Card>
            <Link component={RouterLink} underline="none" variant="body2" to="#">{issue.name}</Link>
        </Card>
    </CardActionArea>)
}

export default IssueCard;