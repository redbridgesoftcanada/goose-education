import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Paper, Tabs, Tab, makeStyles} from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
import { withFirebase } from './components/firebase';
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

const background = 'https://images.unsplash.com/photo-1566694271474-27e7b2de5c16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

let INITIAL_STATE = {
  isLoading: false,
  selectedTab: 0,
  pageTitle: 'Service Centre',
  selectedAnnounce: null,
  selectedMessage: null,
  messagesDB: [],
  announcementsDB: [],
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

    case 'FETCH_ANNOUNCEMENTS':
      return {
        ...state,
        isLoading: false,
        announcementsDB: payload
      }

    case 'SELECTED_TAB':
      return { ...state, selectedTab: payload }
    
    case 'SELECTED_ANNOUNCEMENT':
      let selectedAnnounce = state.announcementsDB.find(announcement => announcement.id.toString() === payload.id);
      return { ...state, selectedAnnounce }

    case 'SELECTED_MESSAGE':
      let selectedMessage = state.messagesDB.find(message => message.id.toString() === payload.id);
      return { ...state, selectedMessage }
  }
}

function ServiceCentre(props) {
  const classes = useStyles();
  const firebase = props.firebase;
  let match = useRouteMatch();

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isLoading, selectedTab, pageTitle, selectedAnnounce, selectedMessage, messagesDB, announcementsDB } = state;
  
  useEffect(() => {
    if (props.location.state && props.location.state.selected) {
      dispatch({ type: 'SELECTED_TAB', payload: props.location.state.selected })
    }

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
          let messageId = doc.id;
          message = {...message, id: messageId}
          allMessages.push(message)
        });

        dispatch({ type: 'FETCH_MESSAGES', payload: allMessages });

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    }

    const findAllAnnouncements = () => {
      const announcementsQuery = firebase.announcements().get();
      announcementsQuery.then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
    
        const allAnnnouncements = [];
        snapshot.forEach(doc => {
          let announcement = doc.data();
          let announcementId = doc.id;
          announcement = {...announcement, id: announcementId}
          allAnnnouncements.push(announcement)
        });

        dispatch({ type: 'FETCH_ANNOUNCEMENTS', payload: allAnnnouncements });

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    }
    
  dispatch({ type: 'FETCH_INIT' });
  findAllMessages();

  dispatch({ type: 'FETCH_INIT' });
  findAllAnnouncements();
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
              <AuthUserContext.Consumer>
                {authUser => <Announcement authUser={authUser} selectedAnnounce={selectedAnnounce} /> }
              </AuthUserContext.Consumer>
              </Route>
              <Route path={match.path}>
                {isLoading ? <LinearProgress color='secondary'/> : <AnnouncementBoard announcementsDB={announcementsDB} handleClick={event => dispatch({ type: 'SELECTED_ANNOUNCEMENT', payload: event.currentTarget })}/>
                }
              </Route>
            </Switch>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Switch>
              <Route path={`${match.path}/message/:messageID`}>
                <Message selectedMessage={selectedMessage}/>
              </Route>
              <Route path={match.path}>
                {isLoading ? <LinearProgress color='secondary' /> : <MessageBoard messagesDB={messagesDB} handleClick={event => dispatch({ type: 'SELECTED_MESSAGE', payload: event.currentTarget })}/>
                }
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

export default withRoot(withFirebase(ServiceCentre));