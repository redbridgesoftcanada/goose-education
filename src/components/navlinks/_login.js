import React from "react";
import { Button } from '@material-ui/core';
import NavLink from '../customMUI/navlink';

export default function Login(classes) {
  if (!classes) return null;
  
  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to="/login"
        label='Login'/>
    </Button>
  );
};