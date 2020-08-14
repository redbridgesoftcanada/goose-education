import React from 'react';
import { Snackbar, Typography } from "@material-ui/core";

export default function ErrorSnackbar(props) {
  const { isOpen, onCloseHandler, errorMessage } = props;
  
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2000}
      onClose={onCloseHandler}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
      message={<Typography>{errorMessage}</Typography>}/>
  )
}