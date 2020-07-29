import React from 'react';
import withRoot from './withRoot';
import { Grid, useTheme, useMediaQuery} from '@material-ui/core';
import { DatabaseContext } from './components/database';
import { CondenseAppBar, CondenseFooter, NavBar, Footer } from './views/appBars';
import { ResponsiveNavBars, ResponsiveFooters } from './constants/responsiveAppBars';
import RegisterForm from './views/RegisterForm';
import { useStyles } from './styles/register';

function Register() {
  const classes = useStyles();
  const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const loadFooterComponent = state => {
    if (smBreakpoint) {
      return (
      <CondenseFooter
        leftWrapper={state.homeGraphics.footerLeft} 
        rightWrapper={state.homeGraphics.footerRight}/>
      )
    } else {
      return (
      <Footer 
        leftWrapper={state.homeGraphics.footerLeft} 
        rightWrapper={state.homeGraphics.footerRight}/>
      )
    }
  }

  return (
    <>
      {ResponsiveNavBars(mdBreakpoint)}
      <Grid container className={classes.container}>
        <Grid item className={classes.form}>
          <RegisterForm/>
        </Grid>
        
        <Grid item className={classes.footer}>
          {ResponsiveFooters(smBreakpoint)}
        </Grid>
      </Grid>
    </>
  );
}

export default withRoot(Register);