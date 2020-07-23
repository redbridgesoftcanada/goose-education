import React, { useState } from 'react';
import { Card, CardContent, Grid, Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import withRoot from './withRoot';
import { TAGS } from './constants/constants';
import { DatabaseContext } from './components/database';
import Typography from './components/onePirate/Typography';
import TabPanel from './components/TabPanel';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import ArticleBoard from './views/ArticleBoard';
import Poster from './components/Poster';
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

function createPosterCards(classes, cards) {
  const filteredCards = Object.values(cards).filter(card => typeof card !== 'string');

  return (
    <Grid container spacing={3} className={classes.card}>
      <Grid item xs={false} md={3}/>
      {filteredCards.map((card, i) => {
        return (
          <Grid item xs={12} md={3} key={i}>
            <Card>
                <CardContent>
                  <Typography color="secondary">{card.subtitle}</Typography>
                  <span className={classes.bullet}>•</span>
                  <Typography variant="body2" component="p">{card.caption}</Typography>
                </CardContent>
            </Card>
          </Grid>
      )})}
      <Grid item xs={false} md={3}/>
    </Grid>
  )
}

function createTabPanel(selectedTab, history, articles) {
  const tabArticles = articles[selectedTab];
  return (
    <TabPanel value={selectedTab} index={selectedTab} key={selectedTab}>
      {(tabArticles && tabArticles.length) ? 
        <ArticleBoard listOfArticles={tabArticles} history={history} /> 
        : 
        <Typography variant='subtitle1'>There are currently no articles on this topic.</Typography> }
    </TabPanel>
  )
}

function Networking(props) {
  const classes = useStyles();

  const [ selectedTab, setSelectedTab ] = useState(props.location.state.selected);
  const { pageBanner, poster, posterCards, wrapper } = props;
  
  const posterBody = {
    title: poster.title,
    subtitle: poster.subtitle,
    caption: poster.caption,
    other: createPosterCards(classes, posterCards)
  }

  return (
    <>
      <NavBar />
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>
      <Typography variant="h3" marked="center" className={classes.title}>{wrapper.title}</Typography>
      <Typography variant="body1" marked="center" className={classes.description}>{wrapper.caption}</Typography>
      <Paper className={classes.root}>
        <Tabs
          value={selectedTab}
          onChange={(event, value) => setSelectedTab(value)}
          textColor="secondary"
          centered
        >
          {TAGS.map(tab => {
            return <Tab key={tab.toLowerCase()} label={tab}/> 
          })}
        </Tabs>
        <DatabaseContext.Consumer>
          {context => createTabPanel(selectedTab, props.history, context.state.taggedArticles)}
        </DatabaseContext.Consumer>
      </Paper>
      <Poster body={posterBody} backgroundImage={poster.image} layoutType='vancouver_now'/>
      <Footer />
    </>
  );
}

export default withRoot(Networking);