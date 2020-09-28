import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import { ADMIN_PAGES } from '../../constants/constants';
import { fetchUserMedia } from '../../constants/helpers/_instagramAPI';
import { fetchPaginatedQuery } from '../../constants/helpers/_pagination';
import { fetchSelectDocuments } from '../../constants/helpers/_fetchSelect';
import { fetchAllDocuments } from '../../constants/helpers/_fetchAll';

function withFetching(Component) {

  function WithFetchingComponent(props) {  
    const location = useLocation();
    const path = location.pathname;
    const firebase = props.firebase;

    let userId;
    if (firebase.auth.currentUser) {
      userId = firebase.auth.currentUser.uid;
    }

    const INITIAL_STATE = {
      // pagination ----------
      queryLimit: 1,
      isQueryEmpty: {},
      // ---------------------
      featuredArticles: [],
      featuredSchools: [],
      featuredTips: [],
      taggedArticles: [],
      previewMessages: [],
      gooseTips: [],
      listOfUsers: [],
      listOfSchools: [],
      listOfApplications: [],
      listOfHomestays: [],
      listOfAirportRides: [],
      listOfArticles: [],
      listOfMessages: [],
      listOfAnnouncements: [],
      adminAggregates: [],
      adminGraphics: [],
      profile: null,
      schoolApplication: null,
      instagram: []
    }
    const [ state, setState ] = useState(INITIAL_STATE);

    const paginatedQuery = type => {
      return fetchPaginatedQuery(state, firebase, setState, type);
    }

    const adminPageQuery = async page => {
      try {
        if (page === 'Settings') {
          fetchAllDocuments("graphics", firebase, setState);
        } else if (ADMIN_PAGES.includes(page)) {
          await paginatedQuery(page);
        }
      } catch(err) {
        console.log("Unable to fetch data", err);
      }
    }

    if (state.footerGraphics && localStorage.getItem('footer') === null) {
      localStorage.setItem('footer', JSON.stringify(state.footerGraphics));
    }

    useEffect(() => {
      if (!state.footerGraphics) {
        fetchSelectDocuments("location", "graphics", firebase, setState, '/footer');
      }

      switch(path) {
        case '/':
          if (!state.homeGraphics) {
            fetchSelectDocuments("location", "graphics", firebase, setState, path);
          }
          if (!state.featuredSchools.length) {
            fetchSelectDocuments("featured", "schools", firebase, setState, '');
          }
          if (!state.featuredArticles.length) {
            fetchSelectDocuments("featured", "articles", firebase, setState, '');
          }
          if (!state.featuredTips.length) {
            fetchSelectDocuments("featured", "tips", firebase, setState, '');
          }
          if (!state.instagram.length) {
            fetchUserMedia(setState);
          }
          break;
        
        case '/goose':
          if (!state.gooseGraphics) {
            fetchSelectDocuments("location", "graphics", firebase, setState, path);
          }
          if (!state.gooseTips.length) {
            fetchAllDocuments("tips", firebase, setState);
          }
          break;
        
        case '/networking':
          if (!state.networkingGraphics) {
            fetchSelectDocuments("location", "graphics", firebase, setState, path);
          }
          if (!state.listOfArticles.length) {
            fetchAllDocuments("articles", firebase, setState);
          }
          break;
        
        case '/schools':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          fetchAllDocuments("schools", firebase, setState);
          break;

        case '/studyabroad':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          break;

        case '/services':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          fetchAllDocuments("announcements", firebase, setState);
          fetchAllDocuments("messages", firebase, setState);
          break;
        
        case '/profile':
          fetchSelectDocuments("profile", "users", firebase, setState, userId);
          fetchSelectDocuments("schoolApplication", "schoolApplications", firebase, setState, userId);
          break;
        
        case '/login':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          break;
      
        case '/forgotpassword': 
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          break;
        
        case '/admin':
          fetchAllDocuments("aggregates", firebase, setState);
          fetchSelectDocuments("recent", "messages", firebase, setState, '');
          break;

        default:
          console.log('No path to fetch data!');
          return;
      }
    }, [path]);

    return (
    <DatabaseContext.Provider value={{state, paginatedQuery, adminPageQuery}}>
      <Component {...props} />
    </DatabaseContext.Provider>
    )
  }
  return WithFetchingComponent;
};
export default withFetching;