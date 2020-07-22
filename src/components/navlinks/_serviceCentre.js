import React, { useState } from 'react';
import { Button, MenuItem } from '@material-ui/core';
import { FlatMenu, NavLink } from '../customMUI';

export default function ServiceCentre(classes) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>Service Centre</Button>
      <FlatMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ 
          onClick: handleClose, 
          onMouseLeave: handleClose,
        }}>
          
        <MenuItem className={classes.navlinkItem}>
          <NavLink 
            to={{ pathname: '/services', state: { tab: 0 }}}
            label='Announcements'/>
        </MenuItem>

        <MenuItem className={classes.navlinkItem}>
          <NavLink 
            to= {{ pathname: '/services', state: { tab: 1 } }}
            label='Message Board'/>
        </MenuItem>
      </FlatMenu>
    </>
  );
};