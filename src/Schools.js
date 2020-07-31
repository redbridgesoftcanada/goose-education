import React, { useState } from 'react';
import { Paper, Tabs, Tab, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import withRoot from './withRoot';
import { AuthUserContext } from './components/session';
import { ResponsiveNavBars, ResponsiveFooters } from './constants/responsiveAppBars';
import TabPanel from './components/TabPanel';
import PageBanner from './views/PageBanner';
import Poster from './components/Poster';
import ListOfSchools from './views/ListOfSchools';
import HowToUse from './components/HowToUse';
import SchoolInformation from './views/SchoolInformation';
import SchoolApplication from './views/SchoolApplication';
import { useStyles } from './styles/schools';

function Schools(props) {
  const classes = useStyles(props, 'schoolInformation');
  const theme = useTheme();
  const match = useRouteMatch();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const [ selected, setSelected ] = useState({
    tab: props.location.selected ? props.location.selected.tab : 0,
    school: null
  });

  const { listOfSchools, pageBanner, banner, posterTop, posterBottom } = props;
  const listOfSchoolNames = listOfSchools.map(school => school.title);

  // E V E N T  L I S T E N E R S
  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const handleSelectedSchool = event => {
    const selectedSchool = listOfSchools.find(school => school.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, school: selectedSchool }));
  }

  return (
    <>
      {ResponsiveNavBars(mdBreakpoint)}
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
                {configPropsPoster(posterTop, 'schools_top_poster')}
                <ListOfSchools
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
                <Typography className={classes.applicationError}>Please Register or Login to Apply</Typography> 
              }
            </AuthUserContext.Consumer>
          </TabPanel>

      </Paper>
      <HowToUse body={banner}/>
      {configPropsPoster(posterBottom, 'schools_bottom_poster')}
      {ResponsiveFooters(smBreakpoint)}
    </>
  )
}

function configPropsPoster(poster, layoutType) {
  const posterBody = {
    title: poster.title,
    subtitle: poster.subtitle,
    caption: poster.caption,
    other: ''
  }
  return <Poster body={posterBody} backgroundImage={poster.image} layoutType={layoutType}/>
}

export default withRoot(Schools);