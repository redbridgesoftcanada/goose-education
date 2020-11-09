import React, { useState, useContext, useReducer, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Typography } from '@material-ui/core';
import withRoot from './withRoot';
import { TAGS, MuiThemeBreakpoints } from './constants/constants';
import { DatabaseContext } from './components/database';
import { StateContext, DispatchContext } from './components/userActions';
import MarkedTypography from './components/onePirate/Typography';
import TabPanel from './components/TabPanel';
import Poster from './components/Poster';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import PageBanner from './views/PageBanner';
import ArticleBoard from './views/ArticleBoard';
import { useStyles } from './styles/networking';

function actionsReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case 'setCurrentPage': 
      return { ...state, currentPage: payload }
    
    case 'filterToggle': 
      return { ...state, filterOpen: !state.filterOpen }

    case 'filterCategory': {
      const { category, input } = payload;
      return { ...state, [category]: input }
    }

    case 'filterText':
      return { ...state, filterQuery: payload }

    case 'setFilteredArticles': {
      const { filteredContent, selectedTab } = payload;
      const articlesRef = [...state.articles];
      articlesRef[selectedTab] = filteredContent;
      
      return {
        ...state,
        articles: articlesRef,
        isFiltered: true,
        filterOpen: false
      }
    }

    case 'filterReset':
      return { 
          ...state,
          articles: payload,
          isFiltered: false,
          filterOpen: false,
          filterOption: 'Title',
          filterConjunction: 'And',
          filterQuery: ''              
      }

    case 'sortToggle':
      return { ...state, anchorOpen: payload }

    case 'setSort': {
      const { category, sortedArticles, selectedTab } = payload;
      const articlesRef = [...state.articles];
      articlesRef[selectedTab] = sortedArticles;
      
      return { 
        ...state, 
        articles: articlesRef,
        anchorOpen: null,
        anchorSelect: (category !== 'reset' || category !== '') ? category : '',
      }
    }

    case 'composeToggle':
      return { ...state, composeOpen: !state.composeOpen }

    case 'setArticle':
      return { ...state, articleSelect: payload }
                
    default:
      console.log('No matching dispatch type for Networking.')
      return;
  }
}

function Networking({ pageBanner, poster, posterCards, wrapper }) {
  
  const dbArticles = useContext(DatabaseContext).state.taggedArticles;
  const location = useLocation();

  const [ selectedTab, setSelectedTab ] = useState(0);

  const [ state, dispatch ] = useReducer(actionsReducer, {
    currentPage: 0, 
    pageLimit: 5, 
    
    articles: dbArticles,
    articleSelect: (location.state && location.state.article) ? location.state.article : null,
    
    composeOpen: false,   
    anchorOpen: null,     
    anchorSelect: '',
    
    isFiltered: false,    
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: ''
  });

  console.count('Parent state')

  const filterReset = () => dispatch({ type: 'filterReset', payload: dbArticles });

  const posterBody = useRef();
  posterBody.current = {
    title: poster.title,
    subtitle: poster.subtitle,
    caption: poster.caption,
  }
  const xsBreakpoint = MuiThemeBreakpoints().xs;
  const classes = useStyles();

  return (
    <>
      <ResponsiveNavBars/>
      <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>

      <Box className={classes.header}>
        <MarkedTypography variant={!xsBreakpoint ? "h3" : "h4"} marked="center" className={classes.headerTitle}>{wrapper.title}</MarkedTypography>
        <Typography className={classes.headerDescription}>{wrapper.caption}</Typography>
      </Box>

      <Box>
        <DispatchContext.Provider value={dispatch}>
          <StateContext.Provider value={state}>
            {!xsBreakpoint ?
              createTabPanel(classes, selectedTab, setSelectedTab, state.articles[selectedTab], filterReset) : 
              <ArticleBoard selectedTab={selectedTab} filterReset={filterReset}/>
            }
          </StateContext.Provider>
        </DispatchContext.Provider>
      </Box>

      <Poster body={posterBody.current} backgroundImage={poster.image} posterCards={posterCards} layoutType='vancouver_now'/>
      <ResponsiveFooters/>
    </>
  );
}

function createTabPanel(classes, selectedTab, setSelectedTab, tabArticles, filterReset) {
  const isEmpty = !(tabArticles && tabArticles.length);
  return (
    <>
      <Tabs
        variant='fullWidth'
        textColor="secondary"
        value={selectedTab}
        onChange={(event, value) => setSelectedTab(value)}>
        {TAGS.map(tab => <Tab key={tab.toLowerCase()} label={tab}/>)}
      </Tabs>

      <TabPanel className={classes.panel} value={selectedTab} index={selectedTab} key={selectedTab}>
        {isEmpty ?
          <Typography variant='subtitle1'>There are currently no articles on this topic.</Typography> :
          <ArticleBoard selectedTab={selectedTab} filterReset={filterReset}/> 
        }
      </TabPanel>
    </>
  )
}

export default withRoot(Networking);