import { appBarStyles } from './_appbar';
// import { footerStyles } from './_footer';

const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'navbar':
    case 'headerBar':
      return appBarStyles(props, stylesheet);

    // case 'footer': 
    //   return footerStyles(props);
  }
}

export default useStyles;