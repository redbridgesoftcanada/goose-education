import React from 'react';
import { Button, Link } from "@material-ui/core";
import { withFirebase } from '../firebase';

const Logout = ({ classes, firebase }) => (
  <Button onClick={firebase.doSignOut}>
    <Link
      color="inherit"
      variant="h6"
      underline="none"
      className={classes.rightLink}
    >
      {'Sign Out'}
    </Link>
  </Button>
);

export default withFirebase(Logout);