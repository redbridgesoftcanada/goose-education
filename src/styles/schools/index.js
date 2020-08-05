import { schoolInformationStyles } from './_information';
import { schoolApplicationStyles } from './_application';

export const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'schoolInformation':
      return schoolInformationStyles(props)
    
      case 'schoolApplication':
      return schoolApplicationStyles(props)
  }
}