import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import { TAGS } from '../../constants/constants';
import * as helpers from '../../constants/helpers';

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
      listOfUsers: null,
      listOfApplications: null,
      listOfHomestays: null,
      listOfAirportRides: null,
      profile: null,
      schoolApplication: null,
    }
    const [ state, setState ] = useState(INITIAL_STATE);
    // console.count(state)

    useEffect(() => {
      switch(location.pathname) {
        case '/':
          helpers.findFeaturedSchools(firebase, setState);
          helpers.findFeaturedArticles(firebase, setState);
          helpers.findFeaturedTips(firebase, setState);
          break;
        
        case '/goose':
          helpers.findAllTips(firebase, setState);
          break;
        
        case '/networking':
          helpers.findAllArticles(TAGS, firebase, setState);
          break;
        
        case '/schools':
          helpers.findAllSchools(firebase, setState);
          break;
        
        case '/services':
          helpers.findAllAnnouncements(firebase, setState);
          helpers.findAllMessages(firebase, setState);
          break;
        
        case '/profile':
          helpers.findUserById(userId, firebase, setState);
          helpers.findSchoolApplicationById(userId, firebase, setState);
          break;
        
        case '/admin':
          helpers.findAllUsers(firebase, setState);
          helpers.findAllSchools(firebase, setState);
          helpers.findAllSchoolApplications(firebase, setState);
          helpers.findAllHomestayApplications(firebase, setState);
          helpers.findAllAirportRideApplications(firebase, setState);
          helpers.findAllTips(firebase, setState);
          helpers.findAllArticles(TAGS, firebase, setState);
          break;

        default:
          console.log('No path to fetch data!')
      }
    }, [location.pathname]);

    return (
    <DatabaseContext.Provider value={state}>
      <Component {...props} />
    </DatabaseContext.Provider>
    )
  }
  return WithFetchingComponent;
};
export default withFetching;