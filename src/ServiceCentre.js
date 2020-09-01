import React, { useState, useEffect } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
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
  const { listOfAnnouncements, listOfMessages, pageBanner } = props;

  const [ selected, setSelected ] = useState({
    tab: 0, 
    announce: null, 
    message: null 
  });

  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const setSelectedAnnounce = e => {
    const selectedAnnounce = listOfAnnouncements.find(announce => announce.id.toString() === e.currentTarget.id);
    setSelected(prevState => ({ ...prevState, announce: selectedAnnounce }));
  }

  const setSelectedMessage = e => {
    const selectedMessage = listOfMessages.find(message => message.id.toString() === e.currentTarget.id);
    setSelected(prevState => ({ ...prevState, message: selectedMessage }));
  }

  useEffect(() => {
    if (props.location.state.tab) {
      setSelected(prevState => ({...prevState, tab: props.location.state.tab}))
    }
  }, [props.location.state.tab])

  return (
    <>
      <ResponsiveNavBars/>
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
      <ResponsiveFooters/>
    </>
  )
}

export default withRoot(ServiceCentre);