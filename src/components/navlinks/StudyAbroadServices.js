import React, { useState } from 'react';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroadServices(props) {
  const { classes, StyledMenu, StyledMenuItem } = props;

  const [ anchorEl, setAnchorEl ] = useState(null);

  // E V E N T  L I S T E N E R S
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onMouseOver={handleClick}>Study Abroad Services</Button>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{onMouseLeave: handleClose}}
      >
        <StyledMenuItem onClick={handleClose}>
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            className={classes.rightLink}
            component={RouterLink} 
            to={{ pathname: '/studyabroad', state: { selected: 0 }}}>
              Homestay
          </Link>
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            className={classes.rightLink}
            component={RouterLink} 
            to={{ pathname: '/studyabroad', state: { selected: 1 }}}>
              Airport Ride
          </Link>
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
};

export default StudyAbroadServices;