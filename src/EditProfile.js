import React, { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import TabPanel from './components/TabPanel';
import EditProfileForm from './views/EditProfileForm';
import PasswordChangeForm from './views/PasswordChangeForm';
import DeleteAccountForm from './views/DeleteAccountForm';
import withRoot from './withRoot';
import { AuthUserContext, withAuthorization } from './components/session';
import { DatabaseContext } from './components/database';

function EditProfile(authUser) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <ResponsiveNavBars/>

      <Tabs
        centered
        value={selectedTab}
        onChange={(event, newValue) => setSelectedTab(newValue)}>
        <Tab label="Edit Profile"/>
        <Tab label="Change Password"/>
        <Tab label="Delete Account"/>
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <AuthUserContext.Consumer>
          {authUser => 
            <DatabaseContext.Consumer>
              {({ state }) => <EditProfileForm authUser={authUser} profile={state.profile}/>}
            </DatabaseContext.Consumer>
          }
        </AuthUserContext.Consumer>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <PasswordChangeForm/>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <DeleteAccountForm/>
      </TabPanel>

      <ResponsiveFooters/>
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withRoot(EditProfile));