import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ProjectForm from './ProjectForm';
interface Properties {
  open: boolean;
}
export default function DialogForm({ open }: Properties) {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Create new project"}
      </DialogTitle>
      <DialogContent>
        <ProjectForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => open = false}>Cancel</Button>
        <Button onClick={() => {
          alert()
        }} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}