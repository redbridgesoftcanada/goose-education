import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './components/FeatureCarousel';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import TipsThumbnails from './views/TipsThumbnails';
import Footer from './views/Footer';

const background = 'https://images.unsplash.com/photo-1532174990295-ced4e9211e1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
const title = 'Find your own path, make your dreams come true';
const caption = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function Index(props) {
    // (W I P) - mimicking filtered DB queries for schools and networking article posts.
    const { schoolsDB, articlesDB, tipsDB } = props;

    const featuredSchools = schoolsDB.filter(school => school.isFeatured === true);
    const featuredArticles = articlesDB.slice(0,4);
    const previewSchools = schoolsDB.slice(0,3);
    const previewTips = tipsDB.slice(0,3);

  return (
    <>
      <NavBar />
      <PageBanner title={title} caption={caption} backgroundImage={background} layoutType='pageBanner'/>
      <FeatureCarousel featuredSchools={featuredSchools}/>
      <FeatureBoard />
      <ArticleThumbnails featuredArticles={featuredArticles} />
      <TipsThumbnails previewSchools={previewSchools} previewTips={previewTips}/>
      <Footer />
    </>
  );
}

export default withRoot(Index);