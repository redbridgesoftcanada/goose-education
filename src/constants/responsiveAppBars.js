import React from 'react';
import { CondenseAppBar, CondenseFooter, NavBar, Footer } from '../views/appBars';

function ResponsiveNavBars(breakpoint) {
  return (
    !breakpoint ? <NavBar/> : <CondenseAppBar/>
  )
}

function ResponsiveFooters(breakpoint) {
  const { footerLeft, footerRight } = JSON.parse(localStorage.getItem('footer'));
  const props = { leftWrapper: footerLeft, rightWrapper: footerRight }

  return (
    !breakpoint ? <Footer {...props}/> : <CondenseFooter {...props}/>
  )
}

export { ResponsiveNavBars, ResponsiveFooters };