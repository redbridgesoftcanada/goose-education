import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
});

function TermsOfServiceDialog(props) {
  const { classes, open, onClose } = props;

  return (
      <Dialog open={open} scroll={'paper'} onClose={onClose}>
        <DialogTitle>Goose Terms and Conditions</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Chapter 1.</Typography>
          <Typography variant="subtitle2">Article 1.</Typography>
          <Typography variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        </DialogContent>
      </Dialog>
  );
}

export default withStyles(styles)(TermsOfServiceDialog);