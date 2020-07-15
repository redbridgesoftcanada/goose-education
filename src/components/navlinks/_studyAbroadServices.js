import React, { useState } from 'react';
import { Button, Link, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

export default function StudyAbroadServices(classes, StyledMenu, StyledMenuItem) {
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
        <MenuItem className={classes.menuItem}>
          <Link
            className={classes.link}
            component={RouterLink} 
            to={{ pathname: '/studyabroad', state: { selected: 0 }}}>
              Homestay
          </Link>
        </MenuItem>
        <MenuItem className={classes.menuItem}>
          <Link
            className={classes.link}
            component={RouterLink} 
            to={{ pathname: '/studyabroad', state: { selected: 1 }}}>
              Airport Ride
          </Link>
        </MenuItem>
      </StyledMenu>
    </>
  );
};