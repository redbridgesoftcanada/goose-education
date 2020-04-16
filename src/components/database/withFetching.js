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
      listOfSchools: [],
      taggedArticles: [],
      gooseTips: [],
      listOfMessages: [],
      listOfAnnouncements: [],
      listOfUsers: [],
      listOfApplications: null,
      listOfHomestays: null,
      listOfAirportRides: null,
      profile: null,
      schoolApplication: null,
    }
    const [ state, setState ] = useState(INITIAL_STATE);
    // console.count(state)

    const queryLimit = 1;
    const paginatedQuery = () => {
      return HELPERS.paginatedQuery(state, firebase, setState, queryLimit);
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
          HELPERS.paginatedQuery(state, firebase, setState, queryLimit);
          // HELPERS.findAllUsers(firebase, setState);
          HELPERS.findAllSchools(firebase, setState);
          HELPERS.findAllSchoolApplications(firebase, setState);
          HELPERS.findAllHomestayApplications(firebase, setState);
          HELPERS.findAllAirportRideApplications(firebase, setState);
          HELPERS.findAllTips(firebase, setState);
          HELPERS.findAllArticles(TAGS, firebase, setState);
          HELPERS.findAllAnnouncements(firebase, setState);
          HELPERS.findAllMessages(firebase, setState);
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