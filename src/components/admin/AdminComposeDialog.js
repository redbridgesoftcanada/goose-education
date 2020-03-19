import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import SchoolsComposeForm from './SchoolsComposeForm';

export default function AdminComposeDialog(props) {
  const { open, onClose, setSnackbarMessage } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>{"Create New School"}</DialogTitle>
      <DialogContent>
        <SchoolsComposeForm dialogOpen={open} onDialogClose={onClose} setSnackbarMessage={setSnackbarMessage}/>
      </DialogContent>
    </Dialog>
  );
}