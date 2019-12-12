import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroadServices(props) {
    const { classes, StyledMenu, StyledMenuItem } = props;

    const [ anchorEl, setAnchorEl ] = useState(null);
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
              to=
              {{
                pathname: '/studyabroad', 
                state: {
                  title: 'Study Abroad',
                  selected: 0
                }
              }}
            >
              {'Homestay'}
            </Link>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleClose}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              component={RouterLink} 
              to=
              {{
                pathname: '/studyabroad', 
                state: {
                  title: 'Study Abroad',
                  selected: 1
                }
              }}
            >
              {'Airport Ride'}
            </Link>
          </StyledMenuItem>
        </StyledMenu>
      </>
    );
};

StudyAbroadServices.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default StudyAbroadServices;