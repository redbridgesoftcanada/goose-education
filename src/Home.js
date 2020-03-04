import React from 'react';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import FeatureCarousel from './views/FeatureCarousel';
import FeatureBoard from './views/FeatureBoard';
import ArticleThumbnails from './views/ArticleThumbnails';
import SplitThumbnails from './views/SplitThumbnails';
import Footer from './views/Footer';
import { DatabaseContext } from './components/database';

const background = 'https://images.unsplash.com/photo-1532174990295-ced4e9211e1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
const title = 'Find your own path, make your dreams come true';
const caption = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function Index() {
  return (
    <>
      <NavBar />
      <PageBanner title={title} caption={caption} backgroundImage={background} layoutType='pageBanner'/>
      <FeatureBoard />
      <DatabaseContext.Consumer>
        {context => 
          <>
            <FeatureCarousel featuredSchools={context.featuredSchools}/>
            <ArticleThumbnails featuredArticles={context.featuredArticles} />
            <SplitThumbnails previewSchools={context.featuredSchools} previewTips={context.featuredTips}/>
          </>
        }
      </DatabaseContext.Consumer>
      <Footer />
    </>
  );
}

export default withRoot(Index);