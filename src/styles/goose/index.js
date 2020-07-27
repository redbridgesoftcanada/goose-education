import { studyAbroadStyles } from './_studyAbroad';
// import { tipsStyles } from './_tips';

const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'studyAbroad':
      return studyAbroadStyles(props);

    // case 'footer': 
    //   return footerStyles(props);
  }
}

export default useStyles;