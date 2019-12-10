import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './components/FeatureCarousel';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import TipsThumbnails from './views/TipsThumbnails';
import Footer from './views/Footer';

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
      <PageBanner />
      <FeatureCarousel featuredSchools={featuredSchools}/>
      <FeatureBoard />
      <ArticleThumbnails featuredArticles={featuredArticles} />
      <TipsThumbnails previewSchools={previewSchools} previewTips={previewTips}/>
      <Footer />
    </>
  );
}

export default withRoot(Index);