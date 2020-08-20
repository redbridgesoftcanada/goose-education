import React from 'react';
import CondenseAppBar from './CondenseAppBar';
import CondenseFooter from "./CondenseFooter";
import Footer from './Footer';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';
import { MuiThemeBreakpoints } from '../../constants/constants';

function ResponsiveNavBars() {;
  const mdBkpt = MuiThemeBreakpoints().md;
  
  return !mdBkpt ? <NavBar/> : <CondenseAppBar/>
}

function ResponsiveFooters() {
  const smBkpt = MuiThemeBreakpoints().sm;
  const { footerLeft, footerRight } = JSON.parse(localStorage.getItem('footer'));
  const props = { leftWrapper: footerLeft, rightWrapper: footerRight }

  return !smBkpt ? <Footer {...props}/> : <CondenseFooter {...props}/>
}

export { ResponsiveNavBars, ResponsiveFooters, NavDrawer };

export { CondenseAppBar, CondenseFooter, Footer, NavBar }