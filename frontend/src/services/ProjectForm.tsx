import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import { Alert, Avatar, Button, Link, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { StickyNote2 as StickyNoteIcon } from "@mui/icons-material";

import LocaleContext from "../contexts/LocaleContext";
import UserContext from "../contexts/UserContext";
import ProjectService from "../contexts/ServiceContext";

import Authorization from "../payloads/Authorization";
import ErrorContext from "../contexts/ErrorContext";

export default function ProjectForm() {
	const locale = React.useContext(LocaleContext);
	const { projectService } = React.useContext(ProjectService);
	const { setError } = React.useContext(ErrorContext);
	const { setUser } = React.useContext(UserContext);
	return (
		<Stack padding="4px 0px" width={450} alignItems="center" component="form" gap={2} onSubmit={event => {
			event.preventDefault();
			const { nameField, descriptionField } = event.target as HTMLFormElement;
			projectService.create({
				name: nameField.value,
				description: descriptionField.value
			})
				.then(async response => {
					const body = await response.json();
					if (!response.ok)
						throw body as Error;
					const { user, token } = body as Authorization;
					setUser(user);
					localStorage.setItem("token", token);
				})
				.catch(setError);
		}}>
			<TextField fullWidth label={locale.schemas.project.properties.name} name="nameField" required type="text" variant="outlined" />
			<TextField fullWidth label={locale.schemas.project.properties.description} name="descriptionField" required type="text" variant="outlined" multiline rows={4}/>
			<Button fullWidth type="submit" variant="contained">{locale.actions.btnSaveProject}</Button>
		</Stack>
	);
}
