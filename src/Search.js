import React from 'react';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import Footer from './views/Footer';

function Search(props) {
  return (
    <>
      <NavBar />
      <Footer />
    </>
  );
}

export default withRoot(Search);