import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
import { withFirebase } from './components/firebase';
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
  isLoading: false,
  selectedTab: 0,
  pageTitle: 'Service Centre',
  selectedAnnounce: null,
  selectedMessage: null,
  messagesDB: [],
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true
      }
    
    case 'FETCH_MESSAGES':
      return {
        ...state,
        isLoading: false,
        messagesDB: payload
      }

    case 'SELECTED_TAB':
      return { ...state, selectedTab: payload }
    
    case 'SELECTED_ANNOUNCEMENT':
      let selectedAnnounce = payload.database.find(announcement => announcement.id.toString() === payload.selected.id);
      return { ...state, selectedAnnounce }

    case 'SELECTED_MESSAGE':
      let selectedMessage = state.messagesDB.find(message => message.id.toString() === payload.id);
      return { ...state, selectedMessage }
  }
}

function ServiceCenter(props) {
  const classes = useStyles();
  const firebase = props.firebase;
  const { announcementsDB } = props;
  let match = useRouteMatch();

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { selectedTab, pageTitle, selectedAnnounce, selectedMessage, messagesDB } = state;
  
  useEffect(() => {
    dispatch({ type: 'FETCH_INIT' });

    const findAllMessages = () => {
      const messagesQuery = firebase.messages().get();
      messagesQuery.then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
    
        const allMessages = [];
        snapshot.forEach(doc => {
          let message = doc.data();
          let messageID = allMessages.length + 1;
          message = {...message, id: messageID}
          allMessages.push(message)
        });

        dispatch({ type: 'FETCH_MESSAGES', payload: allMessages });

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    }

  findAllMessages();
  }, []);

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
                <AnnouncementBoard announcementsDB={announcementsDB} handleClick={event => dispatch({ type: 'SELECTED_ANNOUNCEMENT', payload: { selected: event.currentTarget, database: announcementsDB } })}/>
              </Route>
            </Switch>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Switch>
              <Route path={`${match.path}/message/:messageID`}>
                <Message selectedMessage={selectedMessage}/>
              </Route>
              <Route path={match.path}>
                <MessageBoard messagesDB={messagesDB} handleClick={event => dispatch({ type: 'SELECTED_MESSAGE', payload: event.currentTarget })}/>
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

export default withRoot(withFirebase(ServiceCenter));