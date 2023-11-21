import React from "react";

import { Card, CardContent, Typography, Box, Stack, Chip, Icon, Tooltip, Paper } from "@mui/material";

import { Draggable } from "react-beautiful-dnd";

import LocaleContext from "../contexts/LocaleContext";

import Issue from "../schemas/Issue";

import IssuePriorityIcon from "./IssuePriorityIcon"
import UserAvatar from "./UserAvatar";
import UserContext from "../contexts/UserContext";
import ColorUtils from "../utils/ColorUtils";

interface Properties {
	issue: Issue;
}

export function IssueCard({ issue }: Properties) {
	const locale = React.useContext(LocaleContext);
	const { user } = React.useContext(UserContext);
	return (
		<Draggable draggableId={issue.id.toString()} isDragDisabled={issue.assignee.id !== user?.id} index={issue.index}>
			{(provided, snapshot) => (
				<Card ref={provided.innerRef} sx={{ mb: 2 }} {...provided.draggableProps} {...provided.dragHandleProps}>
					<CardContent>
						<Typography fontWeight={500} variant="body1">{issue.name}</Typography>
						<Typography color="text.secondary" variant="body2">{issue.description}</Typography>
						{issue.parent && <Typography
							bgcolor={issue.type.color}
							color={ColorUtils.getForeground(issue.type.color)}
							component={Paper}
							display="inline-flex"
							marginY={1}
							paddingX={1}
							textTransform="uppercase"
							variant="subtitle2">
							{issue.parent.name}
						</Typography>}
						<Stack alignItems="center" direction="row" gap={1}>
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
			)}
		</Draggable>
	);
}

export default IssueCard;