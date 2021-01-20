import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import { fetchUserMedia } from '../../constants/helpers/_instagramAPI';
import { fetchPaginatedQuery } from '../../constants/helpers/_pagination';
import { fetchSelectDocuments } from '../../constants/helpers/_fetchSelect';
import { fetchAllDocuments } from '../../constants/helpers/_fetchAll';

function withFetching(Component) {

  function WithFetchingComponent(props) {  
    const { firebase } = props;
    const [ state, setState ] = useState({
      queryLimit: 1,
      isQueryEmpty: {},
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
      schoolApplicationHistory: [],
      homestayApplicationHistory: [],
      airportRideApplicationHistory: [],
      instagram: []
    });

    // [Compose Dialog] dynamically display any changes on submit;
    const triggerFetch = useCallback(collection => {
      switch (collection) {
        case "article": return fetchAllDocuments("articles", firebase, setState);
        case "announces": return fetchAllDocuments("announcements", firebase, setState);
        case "messages": return fetchAllDocuments("messages", firebase, setState);
        default: 
          console.log(`Missing case (logged: ${collection}) to configure data fetch function from Firebase.`);
          return;
      }
    }, [state.taggedArticles, state.listOfAnnouncements, state.listOfMessages]);

    // [Client Pagination]
    const paginatedQuery = type => {
      return fetchPaginatedQuery(state, firebase, setState, type);
    }

    // [Admin Pagination]
    const adminPageQuery = async page => {
      const queryRef = (page === 'Goose Tips') ? 'gooseTips' : (page === 'Overview') ? 'adminAggregates' : `listOf${page}`;
      try {
        if (page === 'Settings') {
          fetchAllDocuments("graphics", firebase, setState);
        } else if (!state[queryRef].length) {
          await paginatedQuery(page);
        }
      } catch(err) {
        console.log("Unable to fetch data", err);
      }
    }

    // [Footer] load graphics (footerLeft, footerRight) into local storage;
    if (state.footerGraphics && localStorage.getItem('footer') === null) {
      localStorage.setItem('footer', JSON.stringify(state.footerGraphics));
    }

    const location = useLocation();
    const path = location.pathname;
    const userId = (firebase.auth.currentUser) ? firebase.auth.currentUser.uid : null;

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
          fetchAllDocuments("articles", firebase, setState);
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
          fetchSelectDocuments("schoolApplicationHistory", "schoolApplications", firebase, setState, userId);
          fetchSelectDocuments("homestayApplicationHistory", "homestayApplications", firebase, setState, userId);
          fetchSelectDocuments("airportApplicationHistory", "airportRideApplications", firebase, setState, userId);
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
        
        case '/privacy':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          break;

        default:
          return;
      }
    }, [path]);

    return (
    <DatabaseContext.Provider value={{
      state, 
      triggerFetch,
      paginatedQuery, 
      adminPageQuery
      }}>
      <Component {...props} />
    </DatabaseContext.Provider>
    )
  }
  return WithFetchingComponent;
};
export default withFetching;