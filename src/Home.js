import React from 'react';
import withRoot from './withRoot';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DatabaseContext } from './components/database';
import FeatureCarousel from './components/FeatureCarousel';
import FeatureArticles from './components/FeatureArticles';
import FeatureOthers from './components/FeatureOthers';
import FeatureInstagram from './components/FeatureInstagram';
import NavButtonBase from './components/NavButtonBase';
import CondenseAppBar from './views/CondenseAppBar';
import CondenseFooter from './views/CondenseFooter';
import NavBar from './views/NavBar';
import Footer from './views/Footer';
import PageBanner from './views/PageBanner';

function Home() {
  const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  const rangeBreakpoint = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  return (
    <DatabaseContext.Consumer>
      {({ state }) => state.homeGraphics &&
        <>
          {!mdBreakpoint ? <NavBar/> : <CondenseAppBar/>} 
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
          
          {!smBreakpoint ?
          <Footer 
            leftWrapper={state.homeGraphics.footerLeft} 
            rightWrapper={state.homeGraphics.footerRight}/>
          :
          <CondenseFooter
            leftWrapper={state.homeGraphics.footerLeft} 
            rightWrapper={state.homeGraphics.footerRight}/>
          }
        </>
      }
    </DatabaseContext.Consumer>
  );
}

export default withRoot(Home);