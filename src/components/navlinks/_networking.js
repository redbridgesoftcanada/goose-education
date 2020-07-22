import React from 'react';
import { Button } from '@material-ui/core';
import NavLink from '../customMUI/navlink';

export default function Networking(classes) {
  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to={{ pathname: '/networking', state: { selected: 0 } }}
        label='Networking'/>
    </Button>
)};