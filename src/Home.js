import React from 'react';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './views/FeatureCarousel';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import FeatureInstagram from './views/FeatureInstagram';
import SplitThumbnails from './views/SplitThumbnails';
import Footer from './views/Footer';
import { DatabaseContext } from './components/database';

function Index() {
  return (
    <DatabaseContext.Consumer>
      {context => context.state.homeGraphics &&
        <>
          <NavBar />
          <PageBanner title={context.state.homeGraphics.homePoster.title} caption={context.state.homeGraphics.homePoster.subtitle} backgroundImage={context.state.homeGraphics.homePoster.image} layoutType='pageBanner'/>
          <FeatureCarousel featuredSchools={context.state.featuredSchools}/>
          <FeatureBoard graphics={context.state.homeGraphics.homeFeatureBoard}/>
          <ArticleThumbnails wrapperText={context.state.homeGraphics.homeBlackWrapper} featuredArticles={context.state.featuredArticles} />
          <SplitThumbnails whiteWrapperText={context.state.homeGraphics.homeWhiteWrapper} redWrapperText={context.state.homeGraphics.homeRedWrapper}
          previewSchools={context.state.featuredSchools} previewTips={context.state.featuredTips}/>
          <FeatureInstagram instagram={context.state.instagram}/>
          <Footer />
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(Index);