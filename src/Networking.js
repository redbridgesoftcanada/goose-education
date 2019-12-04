import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Typography as MUITypography, makeStyles } from '@material-ui/core';
import withRoot from './withRoot';

import Typography from './components/onePirate/Typography';

import NavBar from './views/NavBar';
import HeaderBanner from './views/HeaderBanner';
import ArticleBoard from './views/ArticleBoard';
import VancouverPoster from './views/VancouverPoster';
import Footer from './views/Footer';

const tabs = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),
  },
  board: {
    marginTop: theme.spacing(4),
  }
}));


function TabPanel(props) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;
  
  return (
    <MUITypography
      className={classes.board}
      component="div"
      role="tabpanel"
      hidden={value !== index}
        {...other}
    >
      <Box pb={10}>
        <ArticleBoard />
        {/* {children} */}
      </Box>
    </MUITypography>
  );
}

function createTabPanel(value) {
  let tabPanelItems = [];

  for (let i = 0; i <= tabs.length; i++){
    tabPanelItems.push(<TabPanel value={value} index={i} key={i}></TabPanel>)
  }
  return tabPanelItems;
}

function Networking(props) {
  const classes = useStyles();
  
  const [value, setValue] = useState(0);
  
  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  return (
    <React.Fragment>
      <NavBar />
      <HeaderBanner title={props.location.state.title}/>
      <Typography variant="h3" marked="center" className={classes.title}>
        {props.location.state.title}
      </Typography>
      <Typography variant="body1" marked="center" className={classes.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
      <Paper className={classes.root}>
        <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            centered
        >
          {tabs.map(tab => {
            return <Tab key={tab.toLowerCase()} label={tab}/> 
          })}
        </Tabs>
        {createTabPanel(value)}
      </Paper>
      <VancouverPoster />
      <Footer />
    </React.Fragment>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default withRoot(Networking);