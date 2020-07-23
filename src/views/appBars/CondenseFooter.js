import React from 'react';
import { Grid, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import useStyles from '../../styles/constants';

export default function CondenseFooterBar(props) {
  const classes = useStyles(props, 'footer');
  const { 
    leftWrapper: { FL1, FL2 }, 
    rightWrapper: { FR5 } 
  } = props;

  return (
    <Grid container className={classes.root} component='footer'>
      <Grid container item className={classes.condenseWrapper}>        
        <Grid item>
          {LinkHighlight(classes, '/', FL1.title)}
          {' | '}
          {LinkHighlight(classes, '/privacy', FL2.title)}
        </Grid>

        <Grid item className={classes.copyright}>
          <Copyright {...FR5}/>
        </Grid>
      </Grid>
    </Grid>
  );
}

function LinkHighlight(classes, path, text) {
  return (
    <Link
      component={RouterLink} 
      className={classes.linkHover}
      color="inherit"
      underline="none"
      to={path}
      >
        {text}
    </Link>
  );
}

function Copyright(props) {
  return (
    <>
      {props.title}
      <Link color="inherit">{props.subtitle}</Link>
      {' '}
      {props.caption}
    </>
  );
}