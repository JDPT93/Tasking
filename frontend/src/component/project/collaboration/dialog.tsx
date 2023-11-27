import React from "react";

import {
	Button as MuiButton,
	Dialog as MuiDialog,
	DialogActions as MuiDialogActions,
	DialogContent as MuiDialogContent,
	DialogContentText as MuiDialogContentText,
	DialogTitle as MuiDialogTitle
} from "@mui/material";

import { MainContext, MainContextValue } from "component/main";

import Collaboration from "model/project/collaboration";

import collaborationService from "service/project/collaboration-service";

type Properties = {
	open: boolean,
	value: Collaboration,
	variant: "leave"
	onCancel?: () => void,
	onError?: (error: Error) => void
	onSuccess?: (value: Collaboration) => void
};

function Component({
	open,
	value,
	variant,
	onCancel,
	onError,
	onSuccess
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/collaboration/dialog.json`);
	switch (variant) {
		case "leave": {
			return (
				<MuiDialog fullWidth open={open} onClose={onCancel}>
					<MuiDialogTitle alignItems="center">
						{locale.titles[variant]}
					</MuiDialogTitle>
					<MuiDialogContent>
						<MuiDialogContentText paragraph>{locale.messages[variant]}</MuiDialogContentText>
						<MuiDialogContentText variant="subtitle2">{locale.labels.name}</MuiDialogContentText>
						<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.project.name}</MuiDialogContentText>
						<MuiDialogContentText variant="subtitle2">{locale.labels.description}</MuiDialogContentText>
						<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.project.description}</MuiDialogContentText>
					</MuiDialogContent>
					<MuiDialogActions>
						<MuiButton onClick={onCancel}>{locale.actions.cancel}</MuiButton>
						<MuiButton
							autoFocus
							variant="contained"
							onClick={() => {
								collaborationService.deleteById(value.id)
									.then(async (response: Response) => {
										const body: any = await response.json();
										if (!response.ok) {
											const error: { message: string } = body;
											throw new Error(error.message);
										}
										const collaboration: Collaboration = body;
										onSuccess?.(collaboration);
									})
									.catch((error: Error) => {
										onError?.(error);
									});
							}}
						>
							{locale.actions.leave}
						</MuiButton>
					</MuiDialogActions>
				</MuiDialog>
			);
		}
	}
}

export type CollaborationDialogProperties = Properties;

export const CollaborationDialog = Component;

export default CollaborationDialog;
