import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import SchoolsComposeForm from './SchoolsComposeForm';

export default function AdminComposeDialog(props) {
  const { open, onClose, setSnackbarMessage, formType, isEdit } = props;
  const prevContent = isEdit ? props.prevContent : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>Create New {formType}</DialogTitle>
      <DialogContent>
        <SchoolsComposeForm dialogOpen={open} onDialogClose={onClose} setSnackbarMessage={setSnackbarMessage} prevContent={prevContent}/>
      </DialogContent>
    </Dialog>
  );
}