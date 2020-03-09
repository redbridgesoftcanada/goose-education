import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import * as helpers from '../../constants/helpers';

const tags = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

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
          helpers.findAllArticles(tags, firebase, setState);
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

        default:
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