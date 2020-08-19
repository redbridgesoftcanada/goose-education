import { appBarStyles } from './_appbar';
import { buttonStyles } from './_buttons';
import { commentStyles } from './_comments';
import { pageBannerStyles } from './_pageBanner';
import { pageBannerLayoutStyles } from './_pageBannerLayout';
import { posterStyles } from './_poster';
import { footerStyles } from './_footer';

const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'buttons':
      return buttonStyles(props);

    case 'comments':
      return commentStyles(props);

    case 'navbar':
    case 'headerBar':
      return appBarStyles(props, stylesheet);

    case 'pageBanner':
      return pageBannerStyles(props);
    
    case 'pageBannerLayout': 
      return pageBannerLayoutStyles(props);

    case 'poster':
      return posterStyles(props);
    
    case 'footer': 
      return footerStyles(props);
  }
}

export default useStyles;