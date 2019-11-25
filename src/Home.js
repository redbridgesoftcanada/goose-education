import React from 'react';

import withRoot from './withRoot';
// import ProductSmokingHero from './src/views/ProductSmokingHero';
// import ProductHowItWorks from './src/views/ProductHowItWorks';
// import ProductCTA from './src/views/ProductCTA';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureBoard from './views/FeatureBoard';
import ProductValues from './views/ProductValues';
import ArticlePreview from './views/ArticlePreview';
import Footer from './views/Footer';

function Index() {
  return (
    <React.Fragment>
      <NavBar />
      <PageBanner />
      <FeatureBoard />
      <ProductValues />
      <ArticlePreview />
      <Footer />
    </React.Fragment>
  );
}

export default withRoot(Index);