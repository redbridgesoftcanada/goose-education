import React from 'react';
import CondenseAppBar from './CondenseAppBar';
import CondenseFooter from "./CondenseFooter";
import Footer from './Footer';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';

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

export { ResponsiveNavBars, ResponsiveFooters, NavDrawer };

export { CondenseAppBar, CondenseFooter, Footer, NavBar }