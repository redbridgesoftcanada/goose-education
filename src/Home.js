import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import TipsThumbnails from './views/TipsThumbnails';
import Footer from './views/Footer';

function Index() {
  return (
    <React.Fragment>
      <NavBar />
      <PageBanner />
      <FeatureBoard />
      <ArticleThumbnails />
      <TipsThumbnails />
      <Footer />
    </React.Fragment>
  );
}

export default withRoot(Index);