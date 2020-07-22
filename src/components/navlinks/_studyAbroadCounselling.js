import React from 'react';
import { Button } from '@material-ui/core';
import NavLink from '../customMUI/navlink';

export default function StudyAbroadCounselling(classes) {
  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to={{pathname: '/services', state: { selected: 1 }}}
        label='Study Abroad Counselling'/>
    </Button>
)};