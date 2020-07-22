import React from 'react';
import { Button } from '@material-ui/core';
import NavLink from '../customMUI/navlink';

export default function Register(classes) {
  if (!classes) return null;

  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to='/register'
        label='Register'/>
    </Button>
)};