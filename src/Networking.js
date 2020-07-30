import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Tabs, Tab, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import withRoot from './withRoot';
import { TAGS } from './constants/constants';
import { ResponsiveNavBars, ResponsiveFooters } from './constants/responsiveAppBars';
import { DatabaseContext } from './components/database';
import MarkedTypography from './components/onePirate/Typography';
import TabPanel from './components/TabPanel';
import PageBanner from './views/PageBanner';
import ArticleBoard from './views/ArticleBoard';
import Poster from './components/Poster';
import { useStyles } from './styles/networking';

function Networking(props) {
  const classes = useStyles();
  const { pageBanner, poster, posterCards, wrapper } = props;

  const [ selectedTab, setSelectedTab ] = useState(props.location.state.selected);
  
  const theme = useTheme();
  const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const posterBody = {
    title: poster.title,
    subtitle: poster.subtitle,
    caption: poster.caption,
    other: createPosterCards(classes, posterCards)
  }

  return (
    <>
      {ResponsiveNavBars(mdBreakpoint)}
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>

      <Box className={classes.header}>
        <MarkedTypography variant={!xsBreakpoint ? "h3" : "h4"} marked="center" className={classes.title}>{wrapper.title}</MarkedTypography>
        <Typography className={classes.description}>{wrapper.caption}</Typography>
      </Box>

      <Box>
        {!xsBreakpoint &&
          <Tabs
            value={selectedTab}
            onChange={(event, value) => setSelectedTab(value)}
            textColor="secondary"
            variant='fullWidth'
          >
            {TAGS.map(tab => {
              return <Tab key={tab.toLowerCase()} label={tab}/> 
            })}
          </Tabs>
        }

        <DatabaseContext.Consumer>
          {({ state }) => {
            const tabArticles = state.taggedArticles[selectedTab];
            return (
              !xsBreakpoint ? 
                createTabPanel(classes, selectedTab, tabArticles) 
                : 
                <ArticleBoard listOfArticles={tabArticles}/>
            )}
          }
        </DatabaseContext.Consumer>
      </Box>

      <Poster body={posterBody} backgroundImage={poster.image} layoutType='vancouver_now'/>
      
      {ResponsiveFooters(smBreakpoint)}
    </>
  );
}

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

function createTabPanel(classes, selectedTab, tabArticles) {
  return (
    <TabPanel className={classes.panel} value={selectedTab} index={selectedTab} key={selectedTab}>
      {tabArticles && tabArticles.length ? 
        <ArticleBoard listOfArticles={tabArticles}/> 
        : 
        <Typography variant='subtitle1'>There are currently no articles on this topic.</Typography> 
      }
    </TabPanel>
  )
}

export default withRoot(Networking);