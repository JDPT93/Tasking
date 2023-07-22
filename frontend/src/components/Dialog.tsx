import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ProjectForm from './ProjectForm';
import LocaleContext from "../contexts/LocaleContext";
import ErrorContext from "../contexts/ErrorContext";


interface Properties {
  open: boolean;
}
export default function DialogForm({ open }: Properties) {
	const locale = React.useContext(LocaleContext);
  const { setError } = React.useContext(ErrorContext);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      
    >
      <DialogTitle id="alert-dialog-title">
        {locale.actions.add} {locale.schemas.project.singular} 
      </DialogTitle>
      <DialogContent>
        <ProjectForm onError={setError}/>
      </DialogContent>
    </Dialog>
  );
}