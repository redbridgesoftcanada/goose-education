import React from 'react';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { DatabaseContext } from '../components/database';
import { CondenseAppBar, CondenseFooter, NavBar, Footer } from '../views/appBars';

function ResponsiveNavBars(theme) {
  // const theme = useTheme();
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  return (
    !mdBreakpoint ? <NavBar/> : <CondenseAppBar/>
  )
}

function ResponsiveFooters(theme) {
  // const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DatabaseContext.Consumer>
      {({ state }) => { 
        const props = { leftWrapper: state.homeGraphics.footerLeft, rightWrapper: state.homeGraphics.footerRight }
    
        return state.homeGraphics && 
          smBreakpoint ? <CondenseFooter {...props}/> : <Footer {...props}/>
        }
      }
    </DatabaseContext.Consumer>
  )
}

export { ResponsiveNavBars, ResponsiveFooters };