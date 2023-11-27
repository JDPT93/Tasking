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
import IterationForm from "component/project/iteration/form";

import Changelog from "model/common/changelog";
import Iteration from "model/project/iteration";
import Project from "model/project/project";

import iterationService from "service/project/iteration-service";

type Properties = {
	open: boolean,
	onCancel?: () => void,
	onError?: (error: Error) => void
} & ({
	project: Project,
	value?: Iteration,
	variant: "create",
	onSuccess?: (value: Iteration) => void
} | {
	project?: undefined,
	value: Iteration,
	variant: "update",
	onSuccess?: (changelog: Changelog<Iteration>) => void
} | {
	project?: undefined,
	value: Iteration,
	variant: "delete",
	onSuccess?: (value: Iteration) => void
});

function Component({
	open,
	project,
	value,
	variant,
	onCancel,
	onError,
	onSuccess
}: Properties) {
	const mainContext: MainContextValue = React.useContext(MainContext);
	const locale: any = require(`locale/${mainContext.state.locale}/project/iteration/dialog.json`);
	switch (variant) {
		case "create": {
			return (
				<MuiDialog open={open} onClose={onCancel}>
					<MuiDialogContent>
						<IterationForm
							project={project}
							value={value}
							variant={variant}
							onCancel={onCancel}
							onError={onError}
							onSuccess={onSuccess}
						/>
					</MuiDialogContent>
				</MuiDialog>
			);
		}
		case "update": {
			return (
				<MuiDialog open={open} onClose={onCancel}>
					<MuiDialogContent>
						<IterationForm
							value={value}
							variant={variant}
							onCancel={onCancel}
							onError={onError}
							onSuccess={onSuccess}
						/>
					</MuiDialogContent>
				</MuiDialog>
			);
		}
		case "delete": {
			return (
				<MuiDialog fullWidth open={open} onClose={onCancel}>
					<MuiDialogTitle alignItems="center">
						{locale.titles[variant]}
					</MuiDialogTitle>
					<MuiDialogContent>
						<MuiDialogContentText paragraph>{locale.messages[variant]}</MuiDialogContentText>
						<MuiDialogContentText variant="subtitle2">{locale.labels.name}</MuiDialogContentText>
						<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.name}</MuiDialogContentText>
						<MuiDialogContentText variant="subtitle2">{locale.labels.description}</MuiDialogContentText>
						<MuiDialogContentText paragraph variant="body2" color="text.secondary">{value.description}</MuiDialogContentText>
					</MuiDialogContent>
					<MuiDialogActions>
						<MuiButton onClick={onCancel}>{locale.actions.cancel}</MuiButton>
						<MuiButton
							autoFocus
							variant="contained"
							onClick={() => {
								iterationService.deleteById(value.id)
									.then(async (response: Response) => {
										const body: any = await response.json();
										if (!response.ok) {
											const error: { message: string } = body;
											throw new Error(error.message);
										}
										const iteration: Iteration = body;
										onSuccess?.(iteration);
									})
									.catch((error: Error) => {
										onError?.(error);
									});
							}}
						>
							{locale.actions.delete}
						</MuiButton>
					</MuiDialogActions>
				</MuiDialog >
			);
		}
	}
}

export type IterationDialogProperties = Properties;

export const IterationDialog = Component;

export default IterationDialog;
