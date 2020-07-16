import React, { useState } from 'react';
import { Button, MenuItem } from '@material-ui/core';
import { StyledMenu, LinkButton } from '../customMUI';

export default function StudyAbroadServices(classes) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>Study Abroad Services</Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ 
          onClick: handleClose, 
          onMouseLeave: handleClose,
        }}>
        <MenuItem className={classes.navlinkItem}>
          <LinkButton 
            to={{ pathname: '/studyabroad', state: { selected: 0 }}}
            label='Homestay'/>
        </MenuItem>
        <MenuItem className={classes.navlinkItem}>
          <LinkButton 
            to={{ pathname: '/studyabroad', state: { selected: 1 }}}
            label='Airport Ride'/>
        </MenuItem>
      </StyledMenu>
    </>
  );
};