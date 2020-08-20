import React, { useState, useEffect } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import withRoot from './withRoot';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import TabPanel from './components/TabPanel';
import { DatabaseContext } from './components/database';
import GooseCoreFeatures from './components/GooseCoreFeatures';
import GoosePlatform from './components/GoosePlatform';
import Poster from './components/Poster';
import PageBanner from './views/PageBanner';
import GooseTips from './views/GooseTips';
import useStyles from './styles/goose';

function GooseEdu(props) {
  const classes = useStyles(props, 'studyAbroad');

  // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
  const [value, setValue] = useState(props.location.state.selected);
  const handleChange = (event, newValue) => setValue(newValue);

  useEffect(() => {
    setValue(props.location.state.selected)
  }, [props.location.state.selected]);

  return (
      <>
        <ResponsiveNavBars/>
        <PageBanner title={props.pageBanner.title} backgroundImage={props.pageBanner.image} layoutType='headerBanner'/>
        <Paper className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            variant="fullWidth"
            centered
          >
            <Tab label="Goose Education"/>
            <Tab label="Goose Tips"/>
          </Tabs>
            <DatabaseContext.Consumer>
              {({ state }) => state.gooseGraphics &&
                <>
                  <TabPanel value={value} index={0}>
                    <Poster 
                      body={state.gooseGraphics.goosePoster} 
                      backgroundImage={state.gooseGraphics.goosePoster.image} layoutType='goose_edu'/>
                    <GooseCoreFeatures 
                      graphics={state.gooseGraphics.gooseFeatureBoard}/>
                    <GoosePlatform 
                      graphics={state.gooseGraphics.gooseCards}/>
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    <GooseTips tips={state.gooseTips}/>
                  </TabPanel>
                </>
              }
            </DatabaseContext.Consumer>
          </Paper>
        <ResponsiveFooters/>
      </>
  )
};

export default withRoot(GooseEdu);