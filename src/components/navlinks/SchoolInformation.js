import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function SchoolInformation(props) {
    const { classes, StyledMenu, StyledMenuItem } = props;

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
                pathname: '/schools', 
                state: {
                  title: 'School Information',
                  tab: 0
                }
              }}
            >
              {'School Information'}
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
                pathname: '/schools', 
                state: {
                  title: 'School Information',
                  selected: 1
                }
              }}
            >
              {'School Application'}
            </Link>
          </StyledMenuItem>
        </StyledMenu>
      </>
    );
};

SchoolInformation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SchoolInformation;