import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import Footer from './views/Footer';

function Privacy() {
  return (
    <>
      <NavBar />
      <div style={{marginTop:'50em', marginBottom:'50em'}}></div>
      <Footer />
    </>
  );
}

export default withRoot(Privacy);