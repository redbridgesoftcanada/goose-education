import React, { useState } from 'react';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroad(props) {
    const { classes, StyledMenu, StyledMenuItem } = props;

    const [ anchorEl, setAnchorEl ] = useState(null);
    const handleClick = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <Button onMouseOver={handleClick}>Study Abroad</Button>
        <StyledMenu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{ onMouseLeave: handleClose }}
        >
          <StyledMenuItem onClick={handleClose}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              component={RouterLink} 
              to={{ pathname: '/goose', state: { selected: 0} }}>
                Goose Study Abroad
            </Link>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleClose}>
          <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              component={RouterLink} 
              to={{ pathname: '/goose', state: { selected: 1 } }}>
                Goose Tips
            </Link>
          </StyledMenuItem>
        </StyledMenu>
      </>
    );
};

export default StudyAbroad;