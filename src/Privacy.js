import React from 'react';
import withRoot from './withRoot';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';

function Privacy() {
  return (
    <>
      <ResponsiveNavBars />
      <div style={{marginTop:'50em', marginBottom:'50em'}}></div>
      <ResponsiveFooters />
    </>
  );
}

export default withRoot(Privacy);