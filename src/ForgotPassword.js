import React from 'react';
import withRoot from './withRoot';
import { Grid } from '@material-ui/core';
import { DatabaseContext } from './components/database';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import ForgotPasswordForm from './views/ForgotPasswordForm';
import { useStyles } from './styles/forgotPassword';

function ForgotPassword() {
  const classes = useStyles();

  return (
    <DatabaseContext.Consumer>
      {({ state }) =>
        <>
          <ResponsiveNavBars/>
        
          <Grid container className={classes.container}>
            <Grid item className={classes.form}>
              {state.forgotpasswordGraphics &&
                <ForgotPasswordForm form={state.forgotpasswordGraphics.forgotPasswordForm}/>
              }
            </Grid>
            
            <Grid item className={classes.footer}>
              <ResponsiveFooters/>
            </Grid>
          </Grid>
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(ForgotPassword);