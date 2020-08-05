import { studyAbroadInformationStyles } from './_information';
import { studyAbroadApplicationStyles } from './_application';

export const useStyles = (props, stylesheet) => {
  switch (stylesheet) {
    case 'studyAbroadInformation':
      return studyAbroadInformationStyles(props);

    case 'studyAbroadApplication':
      return studyAbroadApplicationStyles(props);
  }
}