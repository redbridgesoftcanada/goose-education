import React from 'react';
import { Button } from "@material-ui/core";
import NavLink from '../customMUI/navlink';

export default function MyPage(classes) {
  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to="/profile"
        label='My Page'/>
    </Button>
)};