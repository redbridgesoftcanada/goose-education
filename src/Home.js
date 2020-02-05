import React, { useEffect, useState } from 'react';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './views/FeatureCarousel';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import SplitThumbnails from './views/SplitThumbnails';
import Footer from './views/Footer';
import { withFirebase } from "./components/firebase";

const background = 'https://images.unsplash.com/photo-1532174990295-ced4e9211e1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
const title = 'Find your own path, make your dreams come true';
const caption = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function Index({firebase}) {

  const INITIAL_STATE = {
    featuredArticles: [],
    featuredSchools: [],
    featuredTips: [],
  }

  const [ state, setState ] = useState(INITIAL_STATE);
  const { featuredArticles, featuredSchools, featuredTips } = state;

  useEffect(() => {
    const findFeaturedSchools = () => {
        const schoolsQuery = firebase.schools().where('isFeatured', '==', true).get();
        schoolsQuery.then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
      
          let featuredSchools = [];
          snapshot.forEach(doc => featuredSchools.push(doc.data()));
          setState(prevState => ({ ...prevState, featuredSchools }))
        }).catch(err => {
          console.log('Error getting documents', err);
        });
    }

    const findFeaturedArticles = () => {
        const articlesQuery = firebase.articles().where('isFeatured', '==', true).get();
        articlesQuery.then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  

          let featuredArticles = [];
          snapshot.forEach(doc => featuredArticles.push(doc.data()));
          setState(prevState => ({ ...prevState, featuredArticles }))
        }).catch(err => {
          console.log('Error getting documents', err);
        });
    }

    const findFeaturedTips = () => {
        const tipsQuery = firebase.tips().where('isFeatured', '==', true).get();
        tipsQuery.then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  

          let featuredTips = [];
          snapshot.forEach(doc => featuredTips.push(doc.data()));
          setState(prevState => ({ ...prevState, featuredTips }))
        }).catch(err => {
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
      <SplitThumbnails previewSchools={featuredSchools} previewTips={featuredTips}/>
      <Footer />
    </>
  );
}

export default withRoot(withFirebase(Index));