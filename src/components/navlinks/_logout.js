import React from 'react';
import { Button, Link } from "@material-ui/core";
import { withFirebase } from '../firebase';

function Logout({classes, firebase}) {
  return (
    <Button onClick={firebase.doSignOut}>
      <Link className={classes.link}>
        {'Sign Out'}
      </Link>
    </Button>
  )
}

export default withFirebase(Logout);