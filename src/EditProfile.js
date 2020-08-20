import React, { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import TabPanel from './components/TabPanel';
import EditProfileForm from './views/EditProfileForm';
import PasswordChangeForm from './views/PasswordChangeForm';
import withRoot from './withRoot';
import { AuthUserContext, withAuthorization } from './components/session';
import { DatabaseContext } from './components/database';

function EditProfile() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <ResponsiveNavBars/>

      <Tabs
        centered
        value={selectedTab}
        onChange={(event, newValue) => setSelectedTab(newValue)}>
        <Tab label="Edit Profile" />
        <Tab label="Change Password" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <AuthUserContext.Consumer>
          {authUser => 
            <DatabaseContext.Consumer>
              {({ state }) => 
                <EditProfileForm 
                  authUser={authUser} 
                  profile={state.profile}/>
              }
            </DatabaseContext.Consumer>
          }
        </AuthUserContext.Consumer>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <AuthUserContext.Consumer>
          {authUser => <PasswordChangeForm/> }
        </AuthUserContext.Consumer>
      </TabPanel>

      <ResponsiveFooters/>
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withRoot(EditProfile));