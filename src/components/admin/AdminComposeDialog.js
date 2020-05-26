import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import SchoolsComposeForm from "./forms/SchoolsComposeForm";
import UploadImageForm from "./forms/UploadImageForm";
import UploadAttachmentForm from "./forms/UploadAttachmentForm";

export default function AdminComposeDialog(props) {
  const { open, onClose, setSnackbarMessage, formType, isEdit } = props;
  const prevContent = isEdit ? props.prevContent : null;
  const formTitle = isEdit ? `Edit ${formType}` : `Create New ${formType}`;
  const dialogProps = {
    dialogOpen: open,
    onDialogClose: onClose,
    setSnackbarMessage, 
    prevContent,
    formType
  }

  const loadComposeForm = formType => { 
    switch(formType) {
      case "school":
        return <SchoolsComposeForm {...dialogProps}/>

      case "tip":
      case "article":
        return <UploadImageForm {...dialogProps}/>
      
      case "announce":
      case "message":
        return <UploadAttachmentForm {...dialogProps}/>
      
      default:
        return;
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{formTitle}</DialogTitle>
      <DialogContent>
        {loadComposeForm(formType)}
      </DialogContent>
    </Dialog>
  );
}