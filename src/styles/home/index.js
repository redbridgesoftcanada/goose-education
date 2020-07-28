// Material-UI applies JSS for styling (CSS-in-JSS) - an authoring tool for CSS written in JavaScript.

import { featureCarouselStyles } from './_featureCarousel';
import { navButtonBaseStyles } from './_navButtonBase';
import { featureArticlesStyles } from './_featureArticles';
import { featureOthersStyles } from './_featureOthers';
import { featureInstagramStyles } from './_featureInstagram';

export const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'featureCarousel':
      return featureCarouselStyles(props);

    case 'navButtonBase':
      return navButtonBaseStyles(props);

    case 'featureArticles':
      return featureArticlesStyles(props);
    
    case 'featureOthers':
      return featureOthersStyles(props);

    case 'featureInstagram':
      return featureInstagramStyles(props);
  }
}