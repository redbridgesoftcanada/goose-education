import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import { TAGS } from '../../constants/constants';
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

    const queryLimit = 1;
    const paginatedQuery = type => {
      return HELPERS.paginatedQuery(state, firebase, setState, queryLimit, type);
    }

    useEffect(() => {
      switch(location.pathname) {
        case '/':
          HELPERS.findFeaturedSchools(firebase, setState);
          HELPERS.findFeaturedArticles(firebase, setState);
          HELPERS.findFeaturedTips(firebase, setState);
          break;
        
        case '/goose':
          HELPERS.findAllTips(firebase, setState);
          break;
        
        case '/networking':
          HELPERS.findAllArticles(TAGS, firebase, setState);
          break;
        
        case '/schools':
          HELPERS.findAllSchools(firebase, setState);
          break;
        
        case '/services':
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
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Users");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Schools");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Applications");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Homestays");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Airport Rides");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Goose Tips");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Articles");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Announcements");
              await HELPERS.paginatedQuery(state, firebase, setState, queryLimit, "Messages");

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