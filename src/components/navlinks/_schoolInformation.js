import React, { useState } from 'react';
import { Button, MenuItem } from '@material-ui/core';
import { StyledMenu, LinkButton } from '../customMUI';

export default function SchoolInformation(classes) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>School Information</Button>
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
            to={{ pathname: '/schools', selected: { tab: 0 }}}
            label='School Information'/>
        </MenuItem>
        
        <MenuItem className={classes.navlinkItem}>
          <LinkButton 
            to={{ pathname: '/schools', selected: { tab: 1 } }}
            label='School Application'/>
        </MenuItem>
      </StyledMenu>
    </>
  );
};