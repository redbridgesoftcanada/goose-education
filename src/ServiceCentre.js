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

const background = 'https://images.unsplash.com/photo-1566694271474-27e7b2de5c16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

function ServiceCentre(props) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { listOfAnnouncements, listOfMessages } = props;
  const { title, tab } = props.location.state;

  const INITIAL_STATE = { tab, announce: null, message: null }
  const [ selected, setSelected ] = useState(INITIAL_STATE);

  // E V E N T  L I S T E N E R S
  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const handleSelectedAnnounce = event => {
    const selectedAnnounce = listOfAnnouncements.find(announce => announce.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, announce: selectedAnnounce }));
  }

  const handleSelectedMessage = event => {
    const selectedMessage = listOfMessages.find(message => message.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, message: selectedMessage }));
  }

  return (
    <>
      <NavBar/>
      <PageBanner title={title} backgroundImage={background} layoutType='headerBanner'/>
      <Paper className={classes.root}>
        <Tabs textColor="secondary" variant="fullWidth" centered
          value={selected.tab}
          onChange={(event, newValue) => handleTabChange(newValue)}
        >
            <Tab label="Announcements" />
            <Tab label="Message Board" />
        </Tabs>

        <TabPanel value={selected.tab} index={0}>
          <Switch>
            <Route path={`${match.path}/announcement/:announcementID`}>
            <AuthUserContext.Consumer>
              {authUser => <Announcement history={props.history} authUser={authUser} selectedAnnounce={selected.announce} /> }
            </AuthUserContext.Consumer>
            </Route>
            <Route path={match.path}>
              <AnnouncementBoard listOfAnnouncements={listOfAnnouncements} handleClick={handleSelectedAnnounce}/>
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
              <MessageBoard listOfMessages={listOfMessages} handleClick={handleSelectedMessage}/>
            </Route>
          </Switch>
        </TabPanel>
      </Paper>
      <Footer/>
    </>
  )
}

export default withRoot(ServiceCentre);