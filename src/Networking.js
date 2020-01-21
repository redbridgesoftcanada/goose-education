import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import withRoot from './withRoot';

import Typography from './components/onePirate/Typography';
import TabPanel from './components/TabPanel';

import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import ArticleBoard from './views/ArticleBoard';
import Poster from './views/Poster';
import Footer from './views/Footer';

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
  },
  card: {
    marginTop: 270
  },
}));

const tabs = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

let INITIAL_STATE = {
  selectedTab: 0,
  pageTitle: 'Networking'
}

function createTabPanel(value, props) {
  let tabPanelItems = [];

  for (let i = 0; i <= tabs.length; i++){
    tabPanelItems.push(
      <TabPanel value={value} index={i} key={i}>
        <ArticleBoard articlesDB={props.articlesDB}/>
      </TabPanel>
    )
  }
  return tabPanelItems;
}

function Networking(props) {
  const classes = useStyles();
  
  const background = 'https://images.unsplash.com/photo-1564573732309-36969653e65c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1929&q=80';
  const posterBackground = 'https://images.unsplash.com/photo-1543357115-92e515b2c9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
  const posterBody = {
    title: 'Vancouver Now',
    subtitle: 'Share vibrant local information!',
    caption: "On the Networking page, Vancouver's local landscapes, weather, hot places and restaurants, desserts, shops, sales, traffic, event, etc. Share your HOT info in Vancouver with lots of love.",
    other: (
      <Grid container spacing={3} className={classes.card}>
        <Grid item xs={false} md={3}/>
        <Grid item xs={12} md={3}>
          <Card>
              <CardContent>
                <Typography color="secondary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
                <span className={classes.bullet}>•</span>
                <Typography variant="body2" component="p">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Typography>
              </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
              <CardContent>
                <Typography color="secondary">
                    Cat ipsum dolor sit amet
                </Typography>
                <span className={classes.bullet}>•</span>
                <Typography variant="body2" component="p">
                    Cat ipsum dolor sit amet, hunt anything that moves catty ipsum, yet pelt around the house and up and down stairs chasing phantoms but plan steps for world domination.
                </Typography>
              </CardContent>
          </Card>
        </Grid>
        <Grid item xs={false} md={3}/>
      </Grid>
    )
}

  // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
  // const [selectedTab, setSelectedTab] = useState(0);
  const [ state, setState ] = useState(INITIAL_STATE);
  const { selectedTab, pageTitle } = state;

  useEffect(() => {
    if (props.location.state && props.location.state.selected && props.location.state.title) {
      INITIAL_STATE = {
        selectedTab: props.location.state.selected,
        pageTitle: props.location.state.title
      }
    }
    setState(INITIAL_STATE);
  }, [INITIAL_STATE]);

  return (
    <>
      <NavBar />
      <PageBanner title={pageTitle} backgroundImage={background} layoutType='headerBanner'/>
      <Typography variant="h3" marked="center" className={classes.title}>{pageTitle}</Typography>
      <Typography variant="body1" marked="center" className={classes.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
      <Paper className={classes.root}>
        <Tabs
            value={selectedTab}
            onChange={(event, value) => setState({...state, selectedTab: value})}
            textColor="secondary"
            centered
        >
          {tabs.map(tab => {
            return <Tab key={tab.toLowerCase()} label={tab}/> 
          })}
        </Tabs>
        {createTabPanel(selectedTab, props)}
      </Paper>
      <Poster body={posterBody} backgroundImage={posterBackground} layoutType='vancouver_now'/>
      <Footer />
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default withRoot(Networking);