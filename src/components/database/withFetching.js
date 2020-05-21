import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import { ADMIN_PAGES, TAGS } from '../../constants/constants';
import * as HELPERS from '../../constants/helpers';

function withFetching(Component) {

  function WithFetchingComponent(props) {  
    const location = useLocation();
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
      gooseTips: [],
      listOfUsers: [],
      listOfSchools: [],
      listOfApplications: [],
      listOfHomestays: [],
      listOfAirportRides: [],
      listOfArticles: [],
      listOfMessages: [],
      listOfAnnouncements: [],
      profile: null,
      schoolApplication: null,
    }
    const [ state, setState ] = useState(INITIAL_STATE);

    const paginatedQuery = type => {
      return HELPERS.paginatedQuery(state, firebase, setState, type);
    }

    useEffect(() => {
      switch(location.pathname) {
        case '/':
          HELPERS.findGraphics(firebase, setState, '/home');
          HELPERS.findFeaturedSchools(firebase, setState);
          HELPERS.findFeaturedArticles(firebase, setState);
          HELPERS.findFeaturedTips(firebase, setState);
          break;
        
        case '/goose':
          HELPERS.findGraphics(firebase, setState, '/goose');
          HELPERS.findAllTips(firebase, setState);
          break;
        
        case '/networking':
          HELPERS.findGraphics(firebase, setState, '/networking');
          HELPERS.findAllArticles(TAGS, firebase, setState);
          break;
        
        case '/schools':
          HELPERS.findGraphics(firebase, setState, '/schools');
          HELPERS.findAllSchools(firebase, setState);
          break;

        case '/studyabroad':
          HELPERS.findGraphics(firebase, setState, '/studyabroad');

        case '/services':
          HELPERS.findGraphics(firebase, setState, '/services');
          HELPERS.findAllAnnouncements(firebase, setState);
          HELPERS.findAllMessages(firebase, setState);
          break;
        
        case '/profile':
          HELPERS.findUserById(userId, firebase, setState);
          HELPERS.findSchoolApplicationById(userId, firebase, setState);
          break;
        
        case '/admin':
          async function loadInitialData() {
            try {
              for (let i = 0; i <= ADMIN_PAGES.slice(1).length; i++) {
                await paginatedQuery(ADMIN_PAGES[i]);
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
    }, [location.pathname]);

    return (
    <DatabaseContext.Provider value={{state, paginatedQuery}}>
      <Component {...props} />
    </DatabaseContext.Provider>
    )
  }
  return WithFetchingComponent;
};
export default withFetching;