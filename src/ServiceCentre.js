import React, { useState } from 'react';
import { Paper, Tabs, Tab, useMediaQuery, useTheme } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { ResponsiveNavBars, ResponsiveFooters } from './constants/responsiveAppBars';
import { AuthUserContext } from './components/session';
import TabPanel from './components/TabPanel';
import PageBanner from './views/PageBanner';
import AnnouncementBoard from './views/AnnouncementBoard';
import Announcement from './views/Announcement';
import MessageBoard from './views/MessageBoard';
import Message from './views/Message';
import withRoot from './withRoot';

function ServiceCentre(props) {
  const match = useRouteMatch();
  const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  const { listOfAnnouncements, listOfMessages, pageBanner } = props;

  const [ selected, setSelected ] = useState({
    tab: props.location.state ? props.location.state.tab : 0, 
    announce: null, 
    message: null 
  });

  // E V E N T  L I S T E N E R S
  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const setSelectedAnnounce = e => {
    const selectedAnnounce = listOfAnnouncements.find(announce => announce.id.toString() === e.currentTarget.id);
    setSelected(prevState => ({ ...prevState, announce: selectedAnnounce }));
  }

  const setSelectedMessage = e => {
    const selectedMessage = listOfMessages.find(message => message.id.toString() === e.currentTarget.id);
    setSelected(prevState => ({ ...prevState, message: selectedMessage }));
  }

  return (
    <>
      {ResponsiveNavBars(mdBreakpoint)}
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>
      <Paper>
        <Tabs 
          centered
          textColor="secondary" 
          variant="fullWidth" 
          value={selected.tab}
          onChange={(event, newValue) => handleTabChange(newValue)}>
            <Tab label="Announcements"/>
            <Tab label="Message Board"/>
        </Tabs>

        <TabPanel value={selected.tab} index={0}>
          <Switch>
            <Route path={`${match.path}/announcement/:announcementID`}>
              <AuthUserContext.Consumer>
                {authUser => 
                  <Announcement 
                    authUser={authUser} 
                    selectedAnnounce={selected.announce} />}
              </AuthUserContext.Consumer>
            </Route>
            <Route path={match.path}>
              <AnnouncementBoard 
                listOfAnnouncements={listOfAnnouncements} 
                setAnnounce={setSelectedAnnounce}/>
            </Route>
          </Switch>
        </TabPanel>

        <TabPanel value={selected.tab} index={1}>
          <Switch>
            <Route path={`${match.path}/message/:messageID`}>
              <AuthUserContext.Consumer>
                {authUser => 
                  <Message 
                    history={props.history} 
                    authUser={authUser} 
                    selectedMessage={selected.message}/>}
              </AuthUserContext.Consumer>
            </Route>
            <Route path={match.path}>
              <MessageBoard 
                listOfMessages={listOfMessages} 
                setMessage={setSelectedMessage}/>
            </Route>
          </Switch>
        </TabPanel>
      </Paper>
      {ResponsiveFooters(smBreakpoint)}
    </>
  )
}

export default withRoot(ServiceCentre);