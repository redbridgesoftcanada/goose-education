import React, { useEffect, useState } from 'react';
import DatabaseContext from './context';
import { findFeaturedSchools, findFeaturedArticles, findFeaturedTips, findAllTips } from '../../constants/helpers';

function withFetching(Component) {
  function WithFetchingComponent(props) {
    const firebase = props.firebase;

    const INITIAL_STATE = {
      featuredArticles: [],
      featuredSchools: [],
      featuredTips: [],
      gooseTips: [],
    }
    const [ state, setState ] = useState(INITIAL_STATE);

    useEffect(() => {
      findFeaturedSchools(firebase, setState);
      findFeaturedArticles(firebase, setState);
      findFeaturedTips(firebase, setState);
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