import React, { useEffect, useState } from 'react';
import DatabaseContext from './context';
import { findFeaturedSchools, findFeaturedArticles, findFeaturedTips } from '../../constants/helpers';

function withFetching(Component) {
  function WithFetchingComponent(props) {
    const firebase = props.firebase;

    const INITIAL_STATE = {
      featuredArticles: [],
      featuredSchools: [],
      featuredTips: [],
    }
    const [ state, setState ] = useState(INITIAL_STATE);

    useEffect(() => {
      findFeaturedSchools(firebase, setState);
      findFeaturedArticles(firebase, setState);
      findFeaturedTips(firebase, setState);
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