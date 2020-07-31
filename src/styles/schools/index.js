import { schoolInformationStyles } from './_information';

export const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'schoolInformation':
      return schoolInformationStyles(props)
  }
}