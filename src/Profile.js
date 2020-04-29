import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import UserProfile from './views/UserProfile';
import UserApplicationHistory from './views/UserApplicationHistory';
import Footer from './views/Footer';
import { AuthUserContext, withAuthorization } from './components/session';
import { DatabaseContext } from './components/database';

function ProfileBase() {
  return (
    <>
      <NavBar />
      <AuthUserContext.Consumer>
        {authUser =>
          <DatabaseContext.Consumer>
            {context => 
              <>
                <UserProfile authUser={authUser} profile={context.state.profile}/>
                <br/>
                <UserApplicationHistory authUser={authUser} application={context.state.application}/>
              </>
            }
          </DatabaseContext.Consumer>
        }
      </AuthUserContext.Consumer>

      <Footer />
    </>
  );
}

const profile = withRoot(ProfileBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(profile);