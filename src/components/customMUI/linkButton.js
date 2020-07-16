import React from 'react';
import { Button, Link, withStyles } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

const LinkButton = withStyles(theme => ({
  root: {
    ...theme.fontHeader,
    ...theme.typography.h6,
    fontSize: 14,
    color: theme.palette.common.black,
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
  }
}))(props => (
  <Button>
    <Link 
      component={RouterLink}
      {...props}
    >{props.label}</Link>
  </Button>
));

export default LinkButton;