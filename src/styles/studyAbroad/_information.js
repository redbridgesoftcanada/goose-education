import { makeStyles } from '@material-ui/core/styles';

export const studyAbroadInformationStyles = props => {
  return makeStyles(theme => ({    
    container: {
      position: 'relative'
    },
    
    cardContainer: {
      top: '60%',
      position: 'absolute',
      [theme.breakpoints.down('xs')]: {
       top: '50%' 
      }
    },

    cardHeader: {
      padding: theme.spacing(1, 2)
    },
    
    cardTitle: {
      ...theme.typography.h5,
      fontWeight: 700,
      color: theme.palette.common.black,
      textAlign: 'center'
    },

    cardCaption: {
      ...theme.typography.body2,
      color: theme.palette.common.black,
      textAlign: 'center'
    },

    applyButton: {
      justifyContent: 'center'
    },

    step: {
      backgroundColor: theme.palette.secondary.main
    },

    stepLabel: {
      color: `${theme.palette.common.white} !important`,
      fontSize: `${13}px !important`,
      fontWeight: `${600} !important`,
    },

    backButton: {
      marginRight: theme.spacing(1),
    },
    
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },

  }))(props);
}