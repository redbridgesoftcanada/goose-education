import React from 'react';

import withRoot from './withRoot';
// import ProductSmokingHero from './src/views/ProductSmokingHero';
// import ProductValues from './src/views/ProductValues';
// import ProductHowItWorks from './src/views/ProductHowItWorks';
// import ProductCTA from './src/views/ProductCTA';
import NavBar from './views/NavBar';
import ProductHero from './views/ProductHero';
import ProductCategories from './views/ProductCategories';
import AppFooter from './views/AppFooter';

function Index() {
  return (
    <React.Fragment>
      <NavBar />
      <ProductHero />
      <ProductCategories />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);