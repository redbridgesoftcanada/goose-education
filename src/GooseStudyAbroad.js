import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';

import withRoot from './withRoot';
import TabPanel from './components/TabPanel';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './views/Poster';
import GooseCoreFeatures from './views/GooseCoreFeatures';
import GoosePlatform from './views/GoosePlatform';
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

  const background = 'https://images.unsplash.com/photo-1484704324500-528d0ae4dc7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80';
  const posterBackground = 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  const posterBody = {
    title: 'Goose Edu',
    subtitle: 'Enjoy a safer and more convenient way to study abroad with our unique and authentic information!',
    caption: 'Goose Study Abroad is an online platform for those preparing for general study abroad and language study in Canada. We provide a variety of information for free so that you can plan your own study according to your purpose and goals.',
    other: ''
  }

  // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
  const [value, setValue] = useState(props.location.state.selected);
  const handleChange = (event, newValue) => setValue(newValue);

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
                <Tab label="Goose Education" />
                <Tab label="Goose Tips" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Poster body={posterBody} backgroundImage={posterBackground} layoutType='goose_edu'/>
                <GooseCoreFeatures/>
                <GoosePlatform/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <GooseTips {...props}/>
            </TabPanel>
        </Paper>
        <Footer/>
      </>
  )
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default withRoot(GooseEdu);