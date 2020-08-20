import React from 'react';
import withRoot from './withRoot';
import { Grid, useTheme, useMediaQuery} from '@material-ui/core';
import { DatabaseContext } from './components/database';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import LoginForm from './views/LoginForm';
import { useStyles } from './styles/login';

function Login() {
  const classes = useStyles();
  const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {ResponsiveNavBars(mdBreakpoint)}
      <DatabaseContext.Consumer>
        {({ state }) =>
          <Grid container className={classes.container}>
            <Grid item className={classes.form}>
              {state.loginGraphics &&
                <LoginForm loginForm={state.loginGraphics.loginForm}/>
              }
            </Grid>
            
            <Grid item className={classes.footer}>
              {ResponsiveFooters(smBreakpoint)}
            </Grid>
          </Grid>
        }
      </DatabaseContext.Consumer>
    </>
  );
}

export default withRoot(Login);