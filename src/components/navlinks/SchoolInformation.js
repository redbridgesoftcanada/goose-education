import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link, Menu, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

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
                  component={RouterLink}
                  to=
                  {{
                    pathname: '/schools', 
                    state: {
                      title: 'School Information',
                      selected: 0
                    }
                  }}
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
              </MenuItem>
            </Menu>
        </div>
    );
};

SchoolInformation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SchoolInformation;