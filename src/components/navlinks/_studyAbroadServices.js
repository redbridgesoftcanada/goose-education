import React from 'react';
import { Button } from '@material-ui/core';
import { NavLink } from '../customMUI';

export default function StudyAbroadServices(classes) {
  return (
    <Button className={classes.navlinkItem}>
      <NavLink 
        to={'/studyabroad'}
        label='Study Abroad Services'/>
    </Button>
  );
};