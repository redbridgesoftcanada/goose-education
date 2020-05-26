import React, { useState } from 'react';
import { Paper, Tabs, Tab, makeStyles} from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import withRoot from './withRoot';
import { AuthUserContext } from './components/session';
import TabPanel from './components/TabPanel';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import AnnouncementBoard from './views/AnnouncementBoard';
import Announcement from './views/Announcement';
import MessageBoard from './views/MessageBoard';
import Message from './views/Message';
import Footer from './views/Footer';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

function ServiceCentre(props) {
  const classes = useStyles();
  const match = useRouteMatch();
  
  const INITIAL_STATE = { 
    tab: props.location.state.tab, 
    announce: null, 
    message: null 
  }
  const [ selected, setSelected ] = useState(INITIAL_STATE);
  const { listOfAnnouncements, listOfMessages, pageBanner } = props;

  // E V E N T  L I S T E N E R S
  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const setSelectedAnnounce = event => {
    const selectedAnnounce = listOfAnnouncements.find(announce => announce.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, announce: selectedAnnounce }));
  }

  const setSelectedMessage = event => {
    const selectedMessage = listOfMessages.find(message => message.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, message: selectedMessage }));
  }

  return (
    <>
      <NavBar/>
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>
      <Paper className={classes.root}>
        <Tabs textColor="secondary" variant="fullWidth" centered
          value={selected.tab}
          onChange={(event, newValue) => handleTabChange(newValue)}>
            <Tab label="Announcements"/>
            <Tab label="Message Board"/>
        </Tabs>

        <TabPanel value={selected.tab} index={0}>
          <Switch>
            <Route path={`${match.path}/announcement/:announcementID`}>
              <AuthUserContext.Consumer>
                {authUser => <Announcement history={props.history} authUser={authUser} selectedAnnounce={selected.announce} /> }
              </AuthUserContext.Consumer>
            </Route>
            <Route path={match.path}>
              <AnnouncementBoard listOfAnnouncements={listOfAnnouncements} setAnnounce={setSelectedAnnounce}/>
            </Route>
          </Switch>
        </TabPanel>

        <TabPanel value={selected.tab} index={1}>
          <Switch>
            <Route path={`${match.path}/message/:messageID`}>
              <AuthUserContext.Consumer>
                {authUser => <Message history={props.history} authUser={authUser} selectedMessage={selected.message}/> }
              </AuthUserContext.Consumer>
            </Route>
            <Route path={match.path}>
              <MessageBoard listOfMessages={listOfMessages} setMessage={setSelectedMessage}/>
            </Route>
          </Switch>
        </TabPanel>
      </Paper>
      <Footer/>
    </>
  )
}

export default withRoot(ServiceCentre);