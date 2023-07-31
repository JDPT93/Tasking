import * as React from "react";
import { Button, Stack, TextField } from "@mui/material";

import LocaleContext from "../../contexts/LocaleContext";
import UserContext from "../../contexts/UserContext";
import ProjectService from "../../contexts/ServiceContext";
import Project from "../../schemas/Project";

interface Properties {
  onError?: (error: Error) => void;
  onSuccess?: (object: Project) => void;
}

export default function ProjectForm({ onError, onSuccess }: Properties) {
  const locale = React.useContext(LocaleContext);
  const { projectService } = React.useContext(ProjectService);
  const { user } = React.useContext(UserContext);
  return (
    <Stack padding="4px 0px" width={450} alignItems="center" component="form" gap={2} onSubmit={event => {
      event.preventDefault();
      const { nameField, descriptionField } = event.target as HTMLFormElement;
      projectService.create({
        leader: user!,
        name: nameField.value,
        description: descriptionField.value
      } as Project)
        .then(async response => {
          const body = await response.json();
          if (!response.ok) {
            throw body as Error;
          }
          if (onSuccess !== undefined) {
            onSuccess(body as Project)
          }
        })
        .catch(error => {
          if (onError !== undefined) {
            onError(error);
          }
        });
    }}>
      <TextField fullWidth label={locale.schemas.project.properties.name} name="nameField" required type="text" variant="outlined" />
      <TextField fullWidth label={locale.schemas.project.properties.description} name="descriptionField" required type="text" variant="outlined" multiline rows={4} />
      <Button fullWidth type="submit" variant="contained">{locale.actions.save}</Button>
    </Stack>
  );
}
