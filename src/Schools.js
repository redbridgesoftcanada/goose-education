import React, { useState } from 'react';
import { Paper, Tabs, Tab, makeStyles, Typography } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import withRoot from './withRoot';
import { AuthUserContext } from './components/session';
import TabPanel from './components/TabPanel';
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

function Schools(props) {
  const { history, listOfSchools, pageBanner, banner, posterTop, posterBottom } = props;
  const listOfSchoolNames = listOfSchools.map(school => school.title);

  const INITIAL_STATE = { 
    tab: props.location.selected ? props.location.selected.tab : 0, 
    school: null 
  }
  const [ selected, setSelected ] = useState(INITIAL_STATE);

  // E V E N T  L I S T E N E R S
  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const handleSelectedSchool = event => {
    const selectedSchool = listOfSchools.find(school => school.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, school: selectedSchool }));
  }

  const classes = useStyles();
  const match = useRouteMatch();

  const posterTopBody = {
    title: posterTop.title,
    subtitle: posterTop.subtitle,
    caption: posterTop.caption,
    other: ''
  }

  const posterBottomBody = {
    title: posterBottom.title,
    subtitle: posterBottom.subtitle,
    caption: posterBottom.caption,
    other: ''
  }

  return (
    <>
      <NavBar/>
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>
      <Paper className={classes.root}>
          <Tabs
              textColor="secondary"
              variant="fullWidth"
              centered
              value={selected.tab}
              onChange={(event, newValue) => handleTabChange(newValue)}
          >
              <Tab label="School Information" />
              <Tab label="School Application" />
          </Tabs>
          <TabPanel value={selected.tab} index={0}>
            <Switch>
              <Route path={`${match.path}/:schoolID`}>
                <SchoolInformation selectedSchool={selected.school} />
              </Route>
              <Route path={match.path}>
                <Poster body={posterTopBody} backgroundImage={posterTop.image} layoutType='schools_top_poster'/>
                <ListOfSchools
                  history={history}
                  listOfSchools={listOfSchools} 
                  handleSelectedSchool={handleSelectedSchool}/>
              </Route>
            </Switch>
          </TabPanel>
          <TabPanel value={selected.tab} index={1}>
            <AuthUserContext.Consumer>
              {authUser => authUser ? 
                <SchoolApplication authUser={authUser} listOfSchoolNames={listOfSchoolNames} /> 
                : 
                <Typography variant="h5">Please Register or Login to Apply</Typography> 
              }
            </AuthUserContext.Consumer>
          </TabPanel>
      </Paper>
      <HowToUse body={banner}/>
      <Poster body={posterBottomBody} backgroundImage={posterBottom.image} layoutType='schools_bottom_poster'/>
      <Footer/>
    </>
  )
}

export default withRoot(Schools);