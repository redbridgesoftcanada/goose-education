import { announcementStyles } from './_announcement';

const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'announcement':
      return announcementStyles(props)
    
      // case 'schoolApplication':
      // return schoolApplicationStyles(props)
  }
}

export default useStyles;