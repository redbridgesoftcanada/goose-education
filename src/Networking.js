import React, { useState, useContext, useReducer, useRef, useEffect } from 'react';
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
    case 'setArticles': {
      return { ...state, articles: payload }
    }

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

    case 'userActionsToggle':
      return { ...state, editAnchor: payload }
    
    case 'commentToggle':
      return { ...state, commentCollapseOpen: !state.commentCollapseOpen }
    
    case 'deleteConfirmToggle':
      return { 
        ...state, 
        deleteConfirmOpen: !state.deleteConfirmOpen,
        ...!state.deleteConfirmOpen && { editAnchor: null }   
        // synchronize closing the EDIT/DELETE menu in the background
      }
    
    case 'editToggle':
      return { 
        ...state, 
        editDialogOpen: !state.editDialogOpen,
        ...!state.editDialogOpen && { editAnchor: null }   
        // synchronize closing the EDIT/DELETE menu in the background
      }
    
    case 'userActionsReset': 
      return { 
        ...state,
        commentCollapseOpen: true,
        editAnchor: null,
        editDialogOpen: false,
        deleteConfirmOpen: false
      }
                
    default:
      console.log('No matching dispatch type for Networking.')
      return;
  }
}

function Networking() {
  const { 
    taggedArticles, 
    networkingGraphics: {
      networkingPageBanner, 
      networkingPoster, 
      networkingCards, 
      networkingWrapper } 
    } = useContext(DatabaseContext).state;

  const location = useLocation();

  const [ selectedTab, setSelectedTab ] = useState(0);

  const [ state, dispatch ] = useReducer(actionsReducer, {
    currentPage: 0, 
    pageLimit: 5, 
    articles: taggedArticles,
    articleSelect: (location.state && location.state.article) ? location.state.article : null,
    
    composeOpen: false,   
    anchorOpen: null,     
    anchorSelect: '',
    
    isFiltered: false,    
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: '',

    commentCollapseOpen: true,
    editAnchor: null,
    editDialogOpen: false,
    deleteConfirmOpen: false    
  });

  const posterBody = useRef();
  posterBody.current = {
    title: networkingPoster.title,
    subtitle: networkingPoster.subtitle,
    caption: networkingPoster.caption,
  }

  const filterReset = () => dispatch({ type: 'filterReset', payload: taggedArticles });

  useEffect(() => {
    if (location.pathname === '/networking') {
      dispatch({ type: 'setArticle', payload: null });
    }
  }, [location.pathname]);

  useEffect(() => {
    dispatch({ type: 'setArticles', payload: taggedArticles });
  }, [taggedArticles])

  const xsBreakpoint = MuiThemeBreakpoints().xs;
  const classes = useStyles();

  return (
    <>
      <ResponsiveNavBars/>
      <PageBanner title={networkingPageBanner.title} backgroundImage={networkingPageBanner.image} layoutType='headerBanner'/>

      <Box className={classes.header}>
        <MarkedTypography variant={!xsBreakpoint ? "h3" : "h4"} marked="center" className={classes.headerTitle}>{networkingWrapper.title}</MarkedTypography>
        <Typography className={classes.headerDescription}>{networkingWrapper.caption}</Typography>
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

      <Poster body={posterBody.current} backgroundImage={networkingPoster.image} posterCards={networkingCards} layoutType='vancouver_now'/>
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