import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import UserProfile from './views/UserProfile';
import Footer from './views/Footer';

import { withAuthorization } from './components/session';

function ProfileBase() {
  return (
    <>
      <NavBar />
      <UserProfile/>
      <Footer />
    </>
  );
}

const profile = withRoot(ProfileBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(profile);