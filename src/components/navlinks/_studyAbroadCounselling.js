import React from 'react';
import { Button } from '@material-ui/core';
import NavLink from '../customMUI/navlink';
import { AuthUserContext } from '../session';

export default function StudyAbroadCounselling(classes) {
  return (
    <AuthUserContext.Consumer>
      {authUser => authUser &&
      <>
        <Button className={classes.navlinkItem}>
          <NavLink 
            to={{pathname: '/services', state: { tab: 1 }}}
            label='Study Abroad Counselling'/>
        </Button>
      </>
      }
    </AuthUserContext.Consumer>
)};