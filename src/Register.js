import React from 'react';
import withRoot from './withRoot';
import { Grid } from '@material-ui/core';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import RegisterForm from './views/RegisterForm';
import { useStyles } from './styles/register';

function Register() {
  const classes = useStyles();

  return (
    <>
      <ResponsiveNavBars/>
      <Grid container className={classes.container}>
        <Grid item className={classes.form}>
          <RegisterForm/>
        </Grid>
        
        <Grid item className={classes.footer}>
          <ResponsiveFooters/>
        </Grid>
      </Grid>
    </>
  );
}

export default withRoot(Register);