import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link, Menu, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroad(props) {
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
            <Button aria-controls="study-abroad-dropdown" aria-haspopup="true" onMouseOver={handleClick}>Study Abroad</Button>
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
                    pathname: '/goose', 
                    state: {
                      title: 'Goose Study Abroad',
                      selected: 0
                    }
                  }}
                  >
                  {'Goose Study Abroad'}
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
                    pathname: '/goose', 
                    state: {
                      title: 'Goose Study Abroad',
                      selected: 1,
                    }
                  }}
                  >
                  {'Goose Tips'}
                </Link>
              </MenuItem>
            </Menu>
        </div>
    );
};

StudyAbroad.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default StudyAbroad;