import React from 'react';
import withRoot from './withRoot';
import { Grid, useTheme, useMediaQuery} from '@material-ui/core';
import { DatabaseContext } from './components/database';
import { CondenseAppBar, CondenseFooter, NavBar, Footer } from './views/appBars';
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
    <DatabaseContext.Consumer>
      {({ state }) =>
        <>
          {!mdBreakpoint ? <NavBar/> : <CondenseAppBar/>} 
        
          <Grid container className={classes.container}>
            <Grid item className={classes.form}>
              <RegisterForm/>
            </Grid>
            
            <Grid item className={classes.footer}>
              {state.homeGraphics && loadFooterComponent(state)}
            </Grid>
          </Grid>
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(Register);