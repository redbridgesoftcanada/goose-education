import React from 'react';
import withRoot from './withRoot';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import UserProfile from './views/UserProfile';
import UserApplicationHistory from './views/UserApplicationHistory';
import { AuthUserContext, withAuthorization } from './components/session';
import { DatabaseContext } from './components/database';
import ErrorBoundary from './components/ErrorBoundary';

function Profile() {
  return (
    <>
      <ResponsiveNavBars />
      <AuthUserContext.Consumer>
        {authUser =>
          <DatabaseContext.Consumer>
            {({ state }) => 
              <ErrorBoundary>
                <UserProfile 
                  authUser={authUser} 
                  profile={state.profile}/>

                <UserApplicationHistory 
                  authUser={authUser} 
                  applications={state.schoolApplicationHistory}
                  homestay={state.homestayApplicationHistory}
                  airport={state.airportApplicationHistory}/>
              </ErrorBoundary>
            }
          </DatabaseContext.Consumer>
        }
      </AuthUserContext.Consumer>
      <ResponsiveFooters />
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withRoot(Profile));