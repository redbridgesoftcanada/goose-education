import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import DatabaseContext from './context';
import { findFeaturedSchools, findFeaturedArticles, findFeaturedTips, findAllSchools, findAllArticles, findAllTips, findAllMessages, findAllAnnouncements } from '../../constants/helpers';

function withFetching(Component) {
  function WithFetchingComponent(props) {
    const location = useLocation();

    const firebase = props.firebase;
    const tags = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

    const INITIAL_STATE = {
      featuredArticles: [],
      featuredSchools: [],
      featuredTips: [],
      listOfSchools: [],
      taggedArticles: [],
      gooseTips: [],
      listOfMessages: [],
      listOfAnnouncements: []
    }
    const [ state, setState ] = useState(INITIAL_STATE);
    console.log(state);

    useEffect(() => {
      switch(location.pathname) {
        case '/':
          findFeaturedSchools(firebase, setState);
          findFeaturedArticles(firebase, setState);
          findFeaturedTips(firebase, setState);
          break;
        
        case '/goose':
          findAllTips(firebase, setState);
          break;
        
        case '/networking':
          findAllArticles(tags, firebase, setState);
          break;
        
        case '/schools':
          findAllSchools(firebase, setState);
          break;
        
        case '/services':
          findAllAnnouncements(firebase, setState);
          findAllMessages(firebase, setState);
          break;
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