import React, { useState } from 'react';
import { Button, Link, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

export default function SchoolInformation(classes, StyledMenu) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>School Information</Button>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
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
            to={{ pathname: '/schools', selected: { tab: 0 }}}>
              School Information
          </Link>
        </MenuItem>
        
        <MenuItem className={classes.menuItem}>
          <Link
            className={classes.link}
            component={RouterLink}
            to={{ pathname: '/schools', selected: { tab: 1 } }}>
              School Application
          </Link>
        </MenuItem>
      </StyledMenu>
    </>
  );
};