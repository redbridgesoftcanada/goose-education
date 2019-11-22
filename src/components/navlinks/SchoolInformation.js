import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link, Menu, MenuItem } from '@material-ui/core'

function SchoolInformation(props) {
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
            <Button aria-controls="school-information-dropdown" aria-haspopup="true" onMouseOver={handleClick}>
              School Information
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
                  {'School Information'}
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
                  {'School Application'}
                </Link>
              </MenuItem>
            </Menu>
        </div>
    );
};

SchoolInformation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SchoolInformation;