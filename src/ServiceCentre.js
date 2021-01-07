import React, { useState, useEffect, useContext, useReducer } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { Switch, Route, useRouteMatch, useLocation, useHistory } from "react-router-dom";
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import { DatabaseContext } from './components/database';
import { StateContext, DispatchContext } from './components/userActions';
import TabPanel from './components/TabPanel';
import { StatusSnackbar } from './components/customMUI';
import PageBanner from './views/PageBanner';
import ServiceBoard from './views/ServiceBoard';
import Services from './views/Services';
import withRoot from './withRoot';

function actionsReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case 'loadAllAnnounces':
      return { ...state, announces: payload }

    case 'loadAllMessages': 
      return { ...state, messages: payload }

    case 'setAnnounce':
      return { ...state, announceSelect: payload }

    case 'setMessage':
      return { ...state, messageSelect: payload }

    case 'setCurrentPage':
      return { ...state, currentPage: payload }
    
    case 'filterToggle': 
      return { ...state, filterOpen: !state.filterOpen }

    case 'filterCategory': {
      const { category, input } = payload;
      return { ...state, [category]: input }
    }

    case 'filterText':
      return { ...state, filterQuery: payload }

    case 'setFilteredAnnounces':
      return {
        ...state,
        announces: payload,
        isFiltered: true,
        filterOpen: false
      }

    case 'sortToggle':
      return { ...state, anchorOpen: payload }

    case 'setSort': {
      const { category, sortedAnnounces } = payload;
      return { 
        ...state, 
        articles: sortedAnnounces,
        anchorOpen: null,
        anchorSelect: (category !== 'reset' || category !== '') ? category : '',
      }
    }

    case 'composeToggle':
      return { ...state, composeOpen: !state.composeOpen }

    case 'announceReset':
      return { 
        ...state,
        announces: payload,
        isFiltered: false,
        filterOpen: false,
        filterOption: 'Title',
        filterConjunction: 'And',
        filterQuery: ''              
      }

      case 'messageReset':
        return { 
          ...state,
          messages: payload,
          isFiltered: false,
          filterOpen: false,
          filterOption: 'Title',
          filterConjunction: 'And',
          filterQuery: ''              
        }
    
    case 'commentToggle':
      return { ...state, commentCollapseOpen: !state.commentCollapseOpen }

    case 'userActionsToggle':
      return { ...state, editAnchor: payload }

    case 'deleteConfirmToggle':
      return { 
        ...state, 
        deleteConfirmOpen: !state.deleteConfirmOpen,
        ...!state.deleteConfirmOpen && { editAnchor: null }   
        // synchronize closing the EDIT/DELETE menu in the background;
      }
    
    case 'editToggle':
      return { 
        ...state, 
        editDialogOpen: !state.editDialogOpen,
        ...!state.editDialogOpen && { editAnchor: null }   
        // synchronize closing the EDIT/DELETE menu in the background;
      }
    
    case 'userActionsReset': 
      return { 
        ...state,
        commentCollapseOpen: true,
        editAnchor: null,
        editDialogOpen: false,
        deleteConfirmOpen: false
      }
      
    default:
      console.log(`Missing action type (logged: ${action}) for Service Centre reducer function.`);
      return;
  }
}

function ServiceCentre(props) {
  const { 
    listOfAnnouncements,
    listOfMessages, 
    servicesGraphics: { serviceCentrePageBanner }
  } = useContext(DatabaseContext).state;

  const [ state, dispatch ] = useReducer(actionsReducer, {
    currentPage: 0, 
    pageLimit: 5, 
    announces: listOfAnnouncements,
    announceSelect: null,
    messages: listOfMessages,
    messageSelect: null,
    composeOpen: false,
    anchorOpen: null,
    selectedAnchor: '',
    isFiltered: false,
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: '',
    commentCollapseOpen: true,
    editAnchor: null,
    editDialogOpen: false,
    deleteConfirmOpen: false,    
  });

  const [ notification, setNotification ] = useState({
    action: '', 
    message: ''
  });

  const [ selectedTab, setSelectedTab ] = useState(0);

  const setTabValue = (event, newValue) => {
    if (location.pathname !== '/services') history.replace({ pathname: '/services', state: {} });
    setSelectedTab(newValue);
  }

  const announceReset = () => dispatch({ type: 'announceReset', payload: listOfAnnouncements });
  const messageReset = () => dispatch({ type: 'messageReset', payload: listOfMessages });
  
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  // [NavLink] load selected tab value from 'tab' prop in history object;
  useEffect(() => {
    if (!selectedTab && props.location.state.tab) setSelectedTab(props.location.state.tab);
  }, [props.location.state.tab]);

  // [ReactRouter] reset selected content when path returns to '/services';
  useEffect(() => {
    if (location.pathname === '/services') {
      dispatch({ type: 'setAnnounce', payload: null });
      dispatch({ type: 'setMessage', payload: null });
    }
  }, [location.pathname]);

  // [Edit/Delete] update all announcements/messages to dynamically display any changes;
  useEffect(() => {
    dispatch({ type: 'loadAllAnnounces', payload: listOfAnnouncements });
  }, [listOfAnnouncements]);

  useEffect(() => {
    dispatch({ type: 'loadAllMessages', payload: listOfMessages });
  }, [listOfMessages]);

  return (
    <>
      <ResponsiveNavBars/>
      <PageBanner 
        layoutType='headerBanner'
        title={serviceCentrePageBanner.title} 
        backgroundImage={serviceCentrePageBanner.image}/>
      <Paper>
        <Tabs 
          centered
          textColor="secondary" 
          variant="fullWidth" 
          value={selectedTab}
          onChange={setTabValue}>
            <Tab label="Announcements"/>
            <Tab label="Message Board"/>
        </Tabs>

        <DispatchContext.Provider value={{dispatch, setNotification}}>
          <StateContext.Provider value={state}>

            <TabPanel value={selectedTab} index={0}>
              <Switch>
                <Route path={`${match.path}/announcement/:announcementID`}>
                  <Services serviceType='announceSelect'/>
                </Route>
                <Route path={match.path}>
                  <ServiceBoard serviceType='announces' filterReset={announceReset}/>
                </Route>
              </Switch>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <Switch>
                <Route path={`${match.path}/message/:messageID`}>
                  <Services serviceType='messageSelect'/>
                </Route>
                <Route path={match.path}>
                  <ServiceBoard serviceType='messages' filterReset={messageReset}/>
                </Route>
              </Switch>
            </TabPanel>
            x
          </StateContext.Provider>
        </DispatchContext.Provider>
      </Paper>

      {notification.action && notification.message &&
        <StatusSnackbar 
          {...notification}
          onClose={() => setNotification({ action: '',  message: '' })}/>
      }

      <ResponsiveFooters/>
    </>
  )
}

export default withRoot(ServiceCentre);