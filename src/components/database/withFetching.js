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

    useEffect(() => {
      switch(path) {
        case '/':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          fetchSelectDocuments("featured", "schools", firebase, setState, '');
          fetchSelectDocuments("featured", "articles", firebase, setState, '');
          fetchSelectDocuments("featured", "tips", firebase, setState, '');
          fetchUserMedia(setState);
          break;
        
        case '/goose':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          fetchAllDocuments("tips", firebase, setState);
          break;
        
        case '/networking':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          fetchAllDocuments("articles", firebase, setState);
          break;
        
        case '/schools':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);
          fetchAllDocuments("schools", firebase, setState);
          break;

        case '/studyabroad':
          fetchSelectDocuments("location", "graphics", firebase, setState, path);

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
        
        case '/admin':
          async function loadInitialData() {
            fetchAllDocuments("aggregates", firebase, setState);
            fetchSelectDocuments("recent", "messages", firebase, setState, '');
            try {
              for (let i = 0; i <= ADMIN_PAGES.slice(1).length; i++) {
                if (ADMIN_PAGES[i] === "Settings") {
                  fetchAllDocuments("graphics", firebase, setState);
                }
                else {
                  await paginatedQuery(ADMIN_PAGES[i]);
                }
                
              }
            } catch(error) {
              console.log("Unable to fetch data", error)
            }
          }
          loadInitialData();
          break;

        default:
          console.log('No path to fetch data!')
      }
    }, [path]);

    return (
    <DatabaseContext.Provider value={{state, paginatedQuery}}>
      <Component {...props} />
    </DatabaseContext.Provider>
    )
  }
  return WithFetchingComponent;
};
export default withFetching;