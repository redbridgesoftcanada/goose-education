import React from 'react';
import { Snackbar, Typography } from "@material-ui/core";
import useStyles from '../styles/constants';

export default function ErrorSnackbar(isOpen, onCloseHandler, errorMessage) {
  const classes = useStyles({}, 'validations');
  
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2000}
      onClose={onCloseHandler}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
      ContentProps={{classes: {root: classes.snackBar}}}
      message={
        <Typography className={classes.snackBarMessage}>{errorMessage}</Typography>}
    />
  )
}