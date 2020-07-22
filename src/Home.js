import React from 'react';
import withRoot from './withRoot';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DatabaseContext } from './components/database';
import CondenseAppBar from './views/CondenseAppBar';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './views/FeatureCarousel';
import NavButtonBase from './views/NavButtonBase';
import FeatureArticles from './views/FeatureArticles';
import FeatureOthers from './views/FeatureOthers';
import FeatureInstagram from './views/FeatureInstagram';
import Footer from './views/Footer';

function Home() {
  const theme = useTheme();
  const checkAppBarBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  const checkPageBannerBreakpoint = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  return (
    <DatabaseContext.Consumer>
      {({ state }) => state.homeGraphics &&
        <>
          {!checkAppBarBreakpoint ? <NavBar/> : <CondenseAppBar/>} 
          <PageBanner 
            title={state.homeGraphics.homePoster.title} 
            caption={state.homeGraphics.homePoster.subtitle} 
            backgroundImage={state.homeGraphics.homePoster.image}
            layoutType='pageBanner'/>
          {!checkPageBannerBreakpoint &&
            <FeatureCarousel featuredSchools={state.featuredSchools}/>
          }
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
          <Footer 
            leftWrapper={state.homeGraphics.footerLeft} 
            rightWrapper={state.homeGraphics.footerRight}/>
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(Home);