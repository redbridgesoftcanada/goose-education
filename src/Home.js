import React from 'react';

import withRoot from './withRoot';
// import ProductSmokingHero from './src/views/ProductSmokingHero';
// import ProductValues from './src/views/ProductValues';
// import ProductHowItWorks from './src/views/ProductHowItWorks';
// import ProductCTA from './src/views/ProductCTA';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureBoard from './views/FeatureBoard';
import AppFooter from './views/AppFooter';

function Index() {
  return (
    <React.Fragment>
      <NavBar />
      <PageBanner />
      <FeatureBoard />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);