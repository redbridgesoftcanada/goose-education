import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import SchoolsComposeForm from './SchoolsComposeForm';
import TipsComposeForm from './TipsComposeForm';
import ArticleComposeForm from './ArticlesComposeForm';
import UploadAttachmentForm from './UploadAttachmentForm';

export default function AdminComposeDialog(props) {
  const { open, onClose, setSnackbarMessage, formType, isEdit } = props;
  const prevContent = isEdit ? props.prevContent : null;
  const dialogProps = {
    dialogOpen: open,
    onDialogClose: onClose,
    setSnackbarMessage, 
    prevContent,
    formType
  }

  const loadComposeForm = formType => { 
    switch(formType) {
      case 'school':
        return <SchoolsComposeForm {...dialogProps}/>

      case 'tip':
        return <TipsComposeForm {...dialogProps}/>
      
      case 'article':
        return <ArticleComposeForm {...dialogProps}/>
      
      case 'announce':
      case 'message':
        return <UploadAttachmentForm {...dialogProps}/>
      
      default:
        console.log(`No corresponding formType (${formType}) in Admin Compose Dialog.`)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>Create New {formType}</DialogTitle>
      <DialogContent>
        {loadComposeForm(formType)}
      </DialogContent>
    </Dialog>
  );
}