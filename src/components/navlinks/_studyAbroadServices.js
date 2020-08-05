import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { NavLink } from '../customMUI';

export default function StudyAbroadServices(classes) {
  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to={{ pathname: '/studyabroad', state: { selected: 0 }}}
        label='Study Abroad Services'/>
    </Button>
  );
};