import React from 'react';
import withRoot from './withRoot';
import { Grid } from '@material-ui/core';
import { DatabaseContext } from './components/database';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import LoginForm from './views/LoginForm';
import { useStyles } from './styles/login';

function Login() {
  const classes = useStyles();

  return (
    <>
      <ResponsiveNavBars/>
      <DatabaseContext.Consumer>
        {({ state }) =>
          <Grid container className={classes.container}>
            <Grid item className={classes.form}>
              {state.loginGraphics &&
                <LoginForm loginForm={state.loginGraphics.loginForm}/>
              }
            </Grid>
            
            <Grid item className={classes.footer}>
              <ResponsiveFooters/>
            </Grid>
          </Grid>
        }
      </DatabaseContext.Consumer>
    </>
  );
}

export default withRoot(Login);