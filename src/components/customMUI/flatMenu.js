import React from 'react';
import { Menu, withStyles } from '@material-ui/core';

const FlatMenu = withStyles(theme => ({
  paper: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}))(props => (
  <Menu
    elevation={0}
    disableScrollLock={true}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default FlatMenu;