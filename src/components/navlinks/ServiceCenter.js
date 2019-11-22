import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link, Menu, MenuItem } from '@material-ui/core'

function ServiceCenter(props) {
    const { classes } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div>
            <Button aria-controls="service-center-dropdown" aria-haspopup="true" onMouseOver={handleClick}>
              Service Center
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  className={classes.rightLink}
                  // component={}
                >
                  {'Notice'}
                </Link>
              </MenuItem>

              <MenuItem onClick={handleClose}>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  className={classes.rightLink}
                  // component={}
                >
                  {'Study Consultation'}
                </Link>
              </MenuItem>
            </Menu>
        </div>
    );
};

ServiceCenter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default ServiceCenter;