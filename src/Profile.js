import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import UserProfile from './views/UserProfile';
import UserApplicationHistory from './views/UserApplicationHistory';
import PasswordChangeForm from './views/PasswordChangeForm';
import Footer from './views/Footer';

import { AuthUserContext, withAuthorization } from './components/session';

function ProfileBase() {
  return (
    <>
      <NavBar />
      <AuthUserContext.Consumer>
        {authUser =>
          <>
            <UserProfile authUser={authUser} />
            <PasswordChangeForm/>
            <br/>
            <UserApplicationHistory authUser={authUser} />
          </>
        }
      </AuthUserContext.Consumer>

      <Footer />
    </>
  );
}

const profile = withRoot(ProfileBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(profile);