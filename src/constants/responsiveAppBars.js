import React from 'react';
import { DatabaseContext } from '../components/database';
import { CondenseAppBar, CondenseFooter, NavBar, Footer } from '../views/appBars';

function ResponsiveNavBars(breakpoint) {
  return (
    !breakpoint ? <NavBar/> : <CondenseAppBar/>
  )
}

function ResponsiveFooters(breakpoint) {
  return (
    <DatabaseContext.Consumer>
      {({ state }) => { 
        const props = { leftWrapper: state.homeGraphics.footerLeft, rightWrapper: state.homeGraphics.footerRight }
    
        return state.homeGraphics && 
          !breakpoint ? <Footer {...props}/> : <CondenseFooter {...props}/>
        }
      }
    </DatabaseContext.Consumer>
  )
}

export { ResponsiveNavBars, ResponsiveFooters };