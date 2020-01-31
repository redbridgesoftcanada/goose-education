import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Tabs, Tab, makeStyles } from '@material-ui/core';
import withRoot from './withRoot';

import TabPanel from './components/TabPanel';
import NavBar from './views/NavBar';
import EditProfileForm from './views/EditProfileForm';
import PasswordChangeForm from './views/PasswordChangeForm';
import Footer from './views/Footer';

import { AuthUserContext, withAuthorization } from './components/session';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function EditProfileBase(props) {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
    <NavBar/>
    <Grid container className={classes.root}>
      <Grid item xs={2}>
        <Tabs
          orientation="vertical"
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
          className={classes.tabs}
        >
          <Tab label="Edit Profile" />
          <Tab label="Change Password" />
        </Tabs>
      </Grid>

      <Grid item xs={10}>
        <TabPanel value={selectedTab} index={0}>
          <AuthUserContext.Consumer>
            {authUser => <EditProfileForm authUser={authUser} user={props.location.state.user}/> }
          </AuthUserContext.Consumer>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <AuthUserContext.Consumer>
            {authUser => <PasswordChangeForm/> }
          </AuthUserContext.Consumer>
        </TabPanel>
      </Grid>

    </Grid>
    <Footer/>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const editProfile = withRoot(EditProfileBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(editProfile);