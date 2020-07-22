import React from 'react';
import { Button } from "@material-ui/core";
import NavLink from '../customMUI/navlink';
import { withFirebase } from '../firebase';

function Logout({classes, firebase}) {
  return (
    <Button className={classes.navlinkItem} onClick={firebase.doSignOut}>
      <NavLink 
        to='/'
        label='Sign Out'/>
    </Button>
  )
}

export default withFirebase(Logout);