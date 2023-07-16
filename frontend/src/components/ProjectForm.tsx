import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ProjectForm() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      
    </div>
  );
}