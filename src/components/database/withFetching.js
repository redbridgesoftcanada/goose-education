import React, { useEffect, useState } from 'react';
import DatabaseContext from './context';
import { findFeaturedSchools, findFeaturedArticles, findFeaturedTips, findAllSchools, findAllArticles, findAllTips } from '../../constants/helpers';

function withFetching(Component) {
  function WithFetchingComponent(props) {
    const firebase = props.firebase;
    const tags = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

    const INITIAL_STATE = {
      featuredArticles: [],
      featuredSchools: [],
      featuredTips: [],
      listOfSchools: [],
      taggedArticles: [],
      gooseTips: [],
    }
    const [ state, setState ] = useState(INITIAL_STATE);
    // console.log(state);

    useEffect(() => {
      findFeaturedSchools(firebase, setState);
      findFeaturedArticles(firebase, setState);
      findFeaturedTips(firebase, setState);
      findAllSchools(firebase, setState);
      findAllArticles(tags, firebase, setState);
      findAllTips(firebase, setState);
    }, []);

    return (
    <DatabaseContext.Provider value={state}>
      <Component {...props} />
    </DatabaseContext.Provider>
    )
  }
  return WithFetchingComponent;
};
export default withFetching;