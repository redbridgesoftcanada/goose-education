import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function ServiceCenter(props) {
    const { classes, StyledMenu, StyledMenuItem } = props;

    const [ anchorEl, setAnchorEl ] = useState(null);
    const handleClick = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <Button onMouseOver={handleClick}>Service Centre</Button>
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
                pathname: '/services', 
                state: {
                  title: 'Service Centre',
                  tab: 0
                }
              }}
            >
              {'Announcements'}
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
                pathname: '/services', 
                state: {
                  title: 'Service Centre',
                  tab: 1
                }
              }}
            >
              {'Message Board'}
            </Link>
          </StyledMenuItem>
        </StyledMenu>
      </>
    );
};

ServiceCenter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default ServiceCenter;