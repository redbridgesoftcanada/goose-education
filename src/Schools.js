import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, makeStyles, Typography } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
import TabPanel from './components/TabPanel';
import { AuthUserContext } from './components/session';

import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './views/Poster';
import ListOfSchools from './views/ListOfSchools';
import HowToUse from './views/HowToUse';
import Footer from './views/Footer';
import SchoolInformation from './views/SchoolInformation';
import SchoolApplication from './views/SchoolApplication';

const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

const background = 'https://images.unsplash.com/photo-1544108182-8810058c3a7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80';
const posterBackground = 'https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const posterBody = {
  title: 'School Information',
  subtitle: 'Find the best school for you with Goose!',
  caption: "We take a closer look at Vancouver's many schools and provide you with a variety of accurate and up-to-date information to help you choose the school that is best for you. Because different people have different criteria for choosing a school, it's important to find a school that's right for you. Goose Study Abroad objectively introduces all of Vancouver's schools.",
  other: ''
}

const posterBackground2 = 'https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80';
const posterBody2 = {
  title: 'Canada : Vancouver',
  subtitle: '',
  caption: "Vancouver, Canada, is the world's most livable city and is at the top of every year and is known as a safe, beautiful and pleasant city in all areas of culture, environment, education and security. Best of all, Canada speaks the most common American English language, with no special accents among English-speaking countries, so you will be able to communicate with people no matter where you travel or work in the future. In particular, you can enjoy Vancouver's sea, mountains, forests, cities, islands, and lakes while studying English.",
  other: ''
}

let INITIAL_STATE = {
  selectedTab: 0
};

function toggleReducer(state, action) {
  let { type, payload } = action;

  switch(type) {
    case 'SELECTED_TAB':
      return {
        ...state,
        selectedTab: payload
      }
    
    case 'SELECTED_SCHOOL':
      let selectedSchool = payload.database.find(school => school.id.toString() === payload.selected.id);
      return {
        ...state,
        selectedSchool
      }
  }
}

function Schools(props) {
  const { schoolsDB } = props; 
  const classes = useStyles();
  let match = useRouteMatch();

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { selectedTab, selectedSchool } = state;

  useEffect(() => {
    if (props.location.state && props.location.state.selected) {
      INITIAL_STATE = {
        selectedTab: props.location.state.selected
      }
    }
  }, [INITIAL_STATE]);

  return (
    <>
      <NavBar/>
      <PageBanner title={props.location.state.title} backgroundImage={background} layoutType='headerBanner'/>
      <Paper className={classes.root}>
          <Tabs
              textColor="secondary"
              variant="fullWidth"
              centered
              value={selectedTab}
              onChange={(event, newValue) => dispatch({ type: 'SELECTED_TAB', payload: newValue })}
          >
              <Tab label="School Information" />
              <Tab label="School Application" />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <Switch>
              <Route path={`${match.path}/:schoolID`}>
                <SchoolInformation selectedSchool={selectedSchool} />
              </Route>
              <Route path={match.path}>
                <Poster body={posterBody} backgroundImage={posterBackground} layoutType='school_information'/>
                <ListOfSchools schoolsDB={schoolsDB} handleSchoolClick={event => dispatch({ type: 'SELECTED_SCHOOL', payload: { selected: event.target, database: schoolsDB } })}/>
              </Route>
            </Switch>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
          <AuthUserContext.Consumer>
            { authUser => authUser ? <SchoolApplication authUser={authUser} /> : <Typography variant="h5">Please Register or Login to Apply</Typography> }
          </AuthUserContext.Consumer>
          </TabPanel>
      </Paper>
      <HowToUse/>
      <Poster body={posterBody2} backgroundImage={posterBackground2} layoutType='canada_vancouver'/>
      <Footer/>
    </>
  )
}
  
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  // value: PropTypes.any.isRequired,
};

export default withRoot(Schools);