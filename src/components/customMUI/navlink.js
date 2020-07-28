import React from 'react';
import { Link, withStyles } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

const NavLink = withStyles(theme => ({
  root: {
    ...theme.fontHeader,
    ...theme.typography.h6,
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    color: theme.palette.common.black,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
  },
}))(props => (
    <Link 
      component={RouterLink}
      {...props}
    >
      {props.label}
    </Link>
));

export default NavLink;