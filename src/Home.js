import React, { useEffect, useReducer } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './views/FeatureCarousel';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import B2BThumbnails from './views/B2BThumbnails';
import Footer from './views/Footer';

import { withFirebase } from "./components/firebase";

const background = 'https://images.unsplash.com/photo-1532174990295-ced4e9211e1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
const title = 'Find your own path, make your dreams come true';
const caption = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

let INITIAL_STATE = {
  isLoading: false,
  featuredArticles: [],
  featuredSchools: [],
  featuredTips: [],
};

function toggleReducer(state, action) {
  let { type, payload } = action;

  switch(type) {
    case 'FETCH_INIT': 
      return { ...state, isLoading: true }

    case 'FETCH_FEAT_SCHOOLS':
      return {
        ...state,
        isLoading: false,
        featuredSchools: payload
      }

    case 'FETCH_FEAT_ARTICLES':
      return {
        ...state,
        isLoading: false,
        featuredArticles: payload
      }

    case 'FETCH_FEAT_TIPS':
      return {
        ...state,
        isLoading: false,
        featuredTips: payload
      }
  }
}

function Index(props) {
  const firebase = props.firebase;

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { featuredArticles, featuredSchools, featuredTips } = state;

  useEffect(() => {
    dispatch({ type: 'FETCH_INIT' });
    const findFeaturedSchools = () => {
        const schoolsQuery = firebase.schools().where('isFeatured', '==', true).get();
        schoolsQuery.then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
      
          let featuredSchools = [];
          snapshot.forEach(doc => {
            featuredSchools.push(doc.data());
          });
          dispatch({ type: 'FETCH_FEAT_SCHOOLS', payload: featuredSchools });

        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    }

    dispatch({ type: 'FETCH_INIT' });
    const findFeaturedArticles = () => {
        const articlesQuery = firebase.articles().where('isFeatured', '==', true).get();
        articlesQuery.then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  

          let featuredArticles = [];
          snapshot.forEach(doc => {
            featuredArticles.push(doc.data());
          });
          dispatch({ type: 'FETCH_FEAT_ARTICLES', payload: featuredArticles });

        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    }

    dispatch({ type: 'FETCH_INIT' });
    const findFeaturedTips = () => {
        const tipsQuery = firebase.tips().where('isFeatured', '==', true).get();
        tipsQuery.then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  

          let featuredTips = [];
          snapshot.forEach(doc => {
            featuredTips.push(doc.data());
          });
          dispatch({ type: 'FETCH_FEAT_TIPS', payload: featuredTips });

        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    }

    findFeaturedSchools();
    findFeaturedArticles();
    findFeaturedTips();
  }, []);

  return (
    <>
      <NavBar />
      <PageBanner title={title} caption={caption} backgroundImage={background} layoutType='pageBanner'/>
      <FeatureCarousel featuredSchools={featuredSchools}/>
      <FeatureBoard />
      <ArticleThumbnails featuredArticles={featuredArticles} />
      <B2BThumbnails previewSchools={featuredSchools} previewTips={featuredTips}/>
      <Footer />
    </>
  );
}

export default withRoot(withFirebase(Index));