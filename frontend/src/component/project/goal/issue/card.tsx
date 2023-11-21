import React from "react";

import {
	Draggable
} from "react-beautiful-dnd";

import {
	Box as MuiBox,
	Card as MuiCard,
	CardContent as MuiCardContent,
	Chip as MuiChip,
	Icon as MuiIcon,
	Paper as MuiPaper,
	Stack as MuiStack,
	Tooltip as MuiTooltip,
	Typography as MuiTypography
} from "@mui/material";

import PriorityIcon from "component/project/goal/priority/icon";
import UserAvatar from "component/user/avatar";

import Issue from "model/project/goal/issue";

import ColorUtility from "utility/color-utility";

type Properties = {
	value?: Issue
};

function Component({
	value
}: Properties) {
	if (value === undefined) {
		return (<></>);
	}
	return (
		<Draggable draggableId={value.id.toString()} isDragDisabled={false} index={value.index}>
			{(provided, snapshot) => (
				<MuiCard ref={provided.innerRef} sx={{ mb: 2 }} {...provided.draggableProps} {...provided.dragHandleProps}>
					<MuiCardContent>
						<MuiTypography fontWeight={500} variant="body1">{value.name}</MuiTypography>
						<MuiTypography color="text.secondary" variant="body2">{value.description}</MuiTypography>
						{value.parent && <MuiTypography
							bgcolor={ColorUtility.toString(value.type.color)}
							color={ColorUtility.toString(ColorUtility.foreground(value.type.color))}
							component={MuiPaper}
							display="inline-flex"
							marginY={1}
							paddingX={1}
							textTransform="uppercase"
							variant="subtitle2">
							{value.parent.name}
						</MuiTypography>}
						<MuiStack alignItems="center" direction="row" gap={1}>
							<MuiTooltip title={`Tipo: ${value.type.name}`}>
								<MuiIcon sx={{ color: value.type.color }}>{value.type.icon}</MuiIcon>
							</MuiTooltip>
							<MuiTooltip title={`Prioridad: Alta}`}>
								<span>
									<PriorityIcon value={value.priority} />
								</span>
							</MuiTooltip>
							{value.complexity > 0 &&
								<MuiTooltip title={`Complejidad: ${value.complexity}`}>
									<MuiChip label={value.complexity} sx={{ fontSIze: 12, height: 24 }} />
								</MuiTooltip>}
							<MuiBox flexGrow={1} />
							<MuiTooltip title={`Responsable: ${value.assignee.name}`}>
								<span>
									<UserAvatar size="small" value={value.assignee} />
								</span>
							</MuiTooltip>
						</ MuiStack>
					</MuiCardContent>
				</MuiCard>
			)}
		</Draggable>
	);
}

export type IssueCardProperties = Properties;
export const IssueCard = Component;

export default IssueCard;
