import React, { useState } from 'react';
import { Button, Link, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroad(classes, StyledMenu) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>Study Abroad</Button>
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
            to={{ pathname: '/goose', state: { selected: 0 } }}>
              Goose Study Abroad
          </Link>
        </MenuItem>
        <MenuItem className={classes.menuItem}>
        <Link
            className={classes.link}
            component={RouterLink} 
            to={{ pathname: '/goose', state: { selected: 1 } }}>
              Goose Tips
          </Link>
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default StudyAbroad;