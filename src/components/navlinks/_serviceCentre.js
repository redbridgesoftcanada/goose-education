import React, { useState } from 'react';
import { Button, Link, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

export default function ServiceCentre(classes, StyledMenu) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>Service Centre</Button>
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
            to={{ pathname: '/services', state: { tab: 0 }}} >
              Announcements
          </Link>
        </MenuItem>

        <MenuItem className={classes.menuItem}>
          <Link
            className={classes.link}
            component={RouterLink}
            to= {{ pathname: '/services', state: { tab: 1 } }} >
              Message Board
          </Link>
        </MenuItem>
      </StyledMenu>
    </>
  );
};