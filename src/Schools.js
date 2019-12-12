import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import TabPanel from './components/TabPanel';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './views/Poster';
import ListOfSchools from './views/ListOfSchools';
import HowToUse from './views/HowToUse';
import Footer from './views/Footer';
import SchoolInformation from './views/SchoolInformation';

const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

function Schools(props) {
  const { schoolsDB } = props; 
  const classes = useStyles();
  let match = useRouteMatch();
  
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

  // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
  const [value, setValue] = useState(props.location.state.selected);
  const handleChange = (event, newValue) => setValue(newValue);

  const [selectedSchool, setSelectedSchool] = useState(props.location.state.selectedSchool);
  const handleSchoolClick = event => setSelectedSchool(schoolsDB.find(school => school.id.toString() === event.currentTarget.id));

  useEffect(() => {
    setValue(props.location.state.selected)
  }, [props.location.state.selected]);

  return (
    <>
      <NavBar/>
      <PageBanner title={props.location.state.title} backgroundImage={background} layoutType='headerBanner'/>
      <Paper className={classes.root}>
          <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              variant="fullWidth"
              centered
          >
              <Tab label="School Information" />
              {/* if not logged in, disable with <Tooltip> onHover title? */}
              <Tab label="School Application" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Switch>
              <Route path={`${match.path}/:schoolID`}>
                <SchoolInformation selectedSchool={selectedSchool} />
              </Route>
              <Route path={match.path}>
                <Poster body={posterBody} backgroundImage={posterBackground} layoutType='school_information'/>
                <ListOfSchools schoolsDB={schoolsDB} handleSchoolClick={handleSchoolClick}/>
              </Route>
            </Switch>
          </TabPanel>
          <TabPanel value={value} index={1}>
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
  value: PropTypes.any.isRequired,
};

export default withRoot(Schools);