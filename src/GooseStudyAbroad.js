import React, { useState, useEffect } from 'react';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import withRoot from './withRoot';
import TabPanel from './components/TabPanel';
import { DatabaseContext } from './components/database';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './components/Poster';
import GooseCoreFeatures from './components/GooseCoreFeatures';
import GoosePlatform from './components/GoosePlatform';
import GooseTips from './views/GooseTips';
import Footer from './views/Footer';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

function GooseEdu(props) {
  const classes = useStyles();

  // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
  const [value, setValue] = useState(props.location.state.selected);
  const handleChange = (event, newValue) => setValue(newValue);

  useEffect(() => {
    setValue(props.location.state.selected)
  }, [props.location.state.selected]);

  return (
      <>
        <NavBar/>
        <PageBanner title={props.pageBanner.title} backgroundImage={props.pageBanner.image} layoutType='headerBanner'/>
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                variant="fullWidth"
                centered
            >
                <Tab label="Goose Education" />
                <Tab label="Goose Tips" />
            </Tabs>
            <DatabaseContext.Consumer>
              {context => context.state.gooseGraphics &&
                <>
                  <TabPanel value={value} index={0}>
                    <Poster body={context.state.gooseGraphics.goosePoster} backgroundImage={context.state.gooseGraphics.goosePoster.image} layoutType='goose_edu'/>
                    <GooseCoreFeatures graphics={context.state.gooseGraphics.gooseFeatureBoard}/>
                    <GoosePlatform graphics={context.state.gooseGraphics.gooseCards}/>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <GooseTips {...props} gooseTips={context.state.gooseTips}/>
                  </TabPanel>
                </>
              }
              </DatabaseContext.Consumer>
          </Paper>
          <Footer/>
      </>
  )
};

export default withRoot(GooseEdu);