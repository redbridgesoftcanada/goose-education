import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import UserProfile from './views/UserProfile';
import Footer from './views/Footer';

function Profile() {

  return (
    <>
      <NavBar />
      <UserProfile/>
      <Footer />
    </>
  );
}

export default withRoot(Profile);