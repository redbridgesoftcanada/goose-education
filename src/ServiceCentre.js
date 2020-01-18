import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
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

const background = 'https://images.unsplash.com/photo-1566694271474-27e7b2de5c16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

let INITIAL_STATE = {
  selectedTab: 0,
  pageTitle: 'Service Centre',
  selectedAnnounce: null,
  selectedMessage: null
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case 'INITIALIZE':
      return { ...INITIAL_STATE }

    case 'SELECTED_TAB':
      return { ...state, selectedTab: payload }
    
    case 'ANNOUNCEMENT':
      let selectedAnnounce = payload.database.find(announcement => announcement.id.toString() === payload.selected.id);
      return { ...state, selectedAnnounce }

    case 'MESSAGE':
      let selectedMessage = payload.database.find(message => message.id.toString() === payload.selected.id);
      return { ...state, selectedMessage }
  }
}

function ServiceCenter(props) {
  const classes = useStyles();
  const { announcementsDB, messagesDB } = props;
  let match = useRouteMatch();

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { selectedTab, pageTitle, selectedAnnounce, selectedMessage } = state;
  
  useEffect(() => {
    if (props.location.state && props.location.state.selected && props.location.state.title) {
      INITIAL_STATE = {
        ...INITIAL_STATE,
        selectedTab: props.location.state.selected,
        pageTitle: props.location.state.title
      }
    }
    dispatch({ type: 'INITIALIZE' });
  }, [INITIAL_STATE]);

    return (
      <>
        <NavBar/>
        <PageBanner title={pageTitle} backgroundImage={background} layoutType='headerBanner'/>
        <Paper className={classes.root}>
          <Tabs textColor="secondary" variant="fullWidth" centered
            value={selectedTab}
            onChange={(event, newValue) => dispatch({ type: 'SELECTED_TAB', payload: newValue })}
          >
              <Tab label="Announcements" />
              <Tab label="Message Board" />
          </Tabs>

          <TabPanel value={selectedTab} index={0}>
            <Switch>
              <Route path={`${match.path}/announcement/:announcementID`}>
                <Announcement selectedAnnounce={selectedAnnounce} />
              </Route>
              <Route path={match.path}>
                <AnnouncementBoard announcementsDB={announcementsDB} handleClick={event => dispatch({ type: 'ANNOUNCEMENT', payload: { selected: event.currentTarget, database: announcementsDB } })}/>
              </Route>
            </Switch>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Switch>
              <Route path={`${match.path}/message/:messageID`}>
                <Message selectedMessage={selectedMessage}/>
              </Route>
              <Route path={match.path}>
                <MessageBoard messagesDB={messagesDB} handleClick={event => dispatch({ type: 'MESSAGE', payload: { selected: event.currentTarget, database: messagesDB } })}/>
              </Route>
            </Switch>
          </TabPanel>
        </Paper>
        <Footer/>
      </>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    // value: PropTypes.any.isRequired,
};

export default withRoot(ServiceCenter);