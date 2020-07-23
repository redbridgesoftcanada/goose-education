import React from 'react';
import withRoot from './withRoot';
import { Grid, useTheme, useMediaQuery} from '@material-ui/core';
import { DatabaseContext } from './components/database';
import { CondenseAppBar, CondenseFooter, NavBar, Footer } from './views/appBars';
import LoginForm from './views/LoginForm';
import { useStyles } from './styles/login';

function Login() {
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
          
          {/* to position footer at the bottom of shorter page content */}
          <Grid container className={classes.container}>
            <Grid item className={classes.form}>
              {state.loginGraphics &&
                <LoginForm
                  loginForm={state.loginGraphics.loginForm}/>
              }
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

export default withRoot(Login);