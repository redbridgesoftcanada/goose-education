import React from 'react';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './views/FeatureCarousel';
import NavButtonBase from './views/NavButtonBase';
import FeatureArticles from './views/FeatureArticles';
import FeatureOthers from './views/FeatureOthers';
import FeatureInstagram from './views/FeatureInstagram';
import Footer from './views/Footer';
import { DatabaseContext } from './components/database';

function Index() {
  return (
    <DatabaseContext.Consumer>
      {({ state }) => state.homeGraphics &&
        <>
          <NavBar/>
          <PageBanner title={state.homeGraphics.homePoster.title} caption={state.homeGraphics.homePoster.subtitle} backgroundImage={state.homeGraphics.homePoster.image} layoutType='pageBanner'/>
          <FeatureCarousel featuredSchools={state.featuredSchools}/>
          <NavButtonBase graphics={state.homeGraphics.homeFeatureBoard}/>
          <FeatureArticles wrapperText={state.homeGraphics.homeBlackWrapper} featuredArticles={state.featuredArticles} />
          <FeatureOthers whiteWrapperText={state.homeGraphics.homeWhiteWrapper} redWrapperText={state.homeGraphics.homeRedWrapper}
          previewSchools={state.featuredSchools} previewTips={state.featuredTips}/>
          <FeatureInstagram instagram={state.instagram}/>
          <Footer />
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(Index);