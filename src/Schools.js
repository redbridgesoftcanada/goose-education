import React, { useState, useEffect } from 'react';
import { Paper, Tabs, Tab, Typography } from '@material-ui/core';
import { Switch, Redirect, Route, useRouteMatch } from "react-router-dom";
import { AuthUserContext } from './components/session';
import { DatabaseContext } from './components/database';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import TabPanel from './components/TabPanel';
import PageBanner from './views/PageBanner';
import Poster from './components/Poster';
import ListOfSchools from './views/ListOfSchools';
import HowToUse from './components/HowToUse';
import SchoolInformation from './views/SchoolInformation';
import SchoolApplication from './views/SchoolApplication';
import withRoot from './withRoot';
import { useStyles } from './styles/schools';

function Schools(props) {
  const classes = useStyles(props, 'schoolInformation');
  const match = useRouteMatch();

  const [ selected, setSelected ] = useState({ tab: 0, school: null });

  const { listOfSchools, posterTop, posterBottom } = props;

  const handleTabChange = newTab => setSelected(prevState => ({ ...prevState, tab: newTab }));
  
  const handleSelectedSchool = event => {
    const selectedSchool = listOfSchools.find(school => school.id.toString() === event.currentTarget.id);
    setSelected(prevState => ({ ...prevState, school: selectedSchool }));
  }

  useEffect(() => {
    if (props.location.state.selectedSchool) {
      setSelected(prevState => ({...prevState, tab: props.location.state.selected, school: props.location.state.selectedSchool }))
    }
    setSelected(prevState => ({...prevState, tab: props.location.state.selected }))
  }, [props.location.state])

  return (
    <>
      <ResponsiveNavBars/>
      <DatabaseContext.Consumer>
        {({ state: { schoolsGraphics: { schoolInfoPageBanner = {} } } = {} }) => 
          <PageBanner 
            layoutType='headerBanner'
            title={schoolInfoPageBanner.title} 
            backgroundImage={schoolInfoPageBanner.image}/>}
      </DatabaseContext.Consumer>
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

              {props.location.state.selectedSchool && 
                // redirects to /:schoolID if selectedSchool exists (FeatureCarousel, Search Query)
                <Redirect to={{                   
                  pathname: `${match.path}/${props.location.state.selectedSchool.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                  state: {
                      title: 'School Information',
                      selected: 0,
                      school: props.location.state.selectedSchool
                    }
                  }
                }/>
              }
              
              <Route path={`${match.path}/:schoolID`}>
                <SchoolInformation selectedSchool={selected.school} />
              </Route>

              <Route path={match.path}>
                {configPropsPoster(posterTop, 'schools_top_poster')}
                <DatabaseContext.Consumer>
                  {({ state }) => 
                    <ListOfSchools
                      listOfSchools={state.listOfSchools} 
                      handleSelectedSchool={handleSelectedSchool}/>
                  }
                </DatabaseContext.Consumer>
              </Route>
            </Switch>
          </TabPanel>
          
          <TabPanel value={selected.tab} index={1}>
            <AuthUserContext.Consumer>
              {authUser => authUser ? 
                <SchoolApplication authUser={authUser}/> 
                : 
                <Typography className={classes.applicationError}>Please Register or Login to Apply</Typography> 
              }
            </AuthUserContext.Consumer>
          </TabPanel>
      </Paper>
      <DatabaseContext.Consumer>
        {({ state: { schoolsGraphics: { schoolInfoBanner = {} } } = {} }) => 
          <HowToUse body={schoolInfoBanner}/>}
      </DatabaseContext.Consumer>
      {configPropsPoster(posterBottom, 'schools_bottom_poster')}
      <ResponsiveFooters/>
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