import React from 'react';
import withRoot from './withRoot';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import { MuiThemeBreakpoints } from './constants/constants';
import { DatabaseContext } from './components/database';
import FeatureCarousel from './components/FeatureCarousel';
import FeatureArticles from './components/FeatureArticles';
import FeatureOthers from './components/FeatureOthers';
import FeatureInstagram from './components/FeatureInstagram';
import NavButtonBase from './components/NavButtonBase';
import PageBanner from './views/PageBanner';

function Home() {
  const rangeBreakpoint = MuiThemeBreakpoints().range;

  return (
    <DatabaseContext.Consumer>
      {({ state }) => state.homeGraphics &&
        <>
          <ResponsiveNavBars/>
          <PageBanner 
            title={state.homeGraphics.homePoster.title} 
            caption={state.homeGraphics.homePoster.subtitle} 
            backgroundImage={state.homeGraphics.homePoster.image}
            layoutType='pageBanner'/>
          {!rangeBreakpoint && <FeatureCarousel featuredSchools={state.featuredSchools}/>}
          <NavButtonBase graphics={state.homeGraphics.homeFeatureBoard}/>
          <FeatureArticles 
            wrapperText={state.homeGraphics.homeBlackWrapper} 
            featuredArticles={state.featuredArticles} />
          <FeatureOthers 
            whiteWrapperText={state.homeGraphics.homeWhiteWrapper} 
            redWrapperText={state.homeGraphics.homeRedWrapper}
            previewSchools={state.featuredSchools} 
            previewTips={state.featuredTips}/>
          <FeatureInstagram 
            title={state.homeGraphics.homeInstagram.title}
            instagram={state.instagram}/>
          
          <ResponsiveFooters/>
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(Home);