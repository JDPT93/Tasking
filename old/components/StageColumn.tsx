import React from "react";

import { Divider, ImageListItem, Paper, Stack, Typography } from "@mui/material";

import Stage from "../schemas/Stage";

import IssueCard from "./IssueCard";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
import StrictModeDroppable from "./StrictModeDroppable";

interface Properties {
	stage: Stage;
}

export function StageColumn({ stage }: Properties) {
	return (
		<StrictModeDroppable droppableId={stage.id.toString()} type="issue">
			{provided => (
				<Paper elevation={2} sx={{ height: "100%" }}>
					<Typography fontWeight={500} padding={2} textTransform="uppercase" variant="body2">
						{stage.name}
					</Typography>
					<Divider />
					<Stack padding={2} ref={provided.innerRef} {...provided.droppableProps}>
						{stage.issues.sort((left, right) => left.index - right.index).map(issue => (
							<IssueCard issue={issue} key={issue.id.toString()} />
						))}
						{provided.placeholder}
					</Stack>
				</Paper>
			)}
		</StrictModeDroppable>
	);
}

export default StageColumn;