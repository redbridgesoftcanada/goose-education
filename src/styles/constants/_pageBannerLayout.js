import { makeStyles } from '@material-ui/core/styles';

export const pageBannerLayoutStyles = props => {
    
  const flexContainerStyles = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
  const backgroundStyles = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }; 
  
  return makeStyles(theme => ({
    root: {
      alignItems: 'center',
      color: theme.palette.common.white,
      maxHeight: 1300,
      position: 'relative',
    },
    
    pageRoot: {
      height: '80vh',
      minHeight: 500,
      [theme.breakpoints.down('sm')]: { 
        height: '40vh'
      }
    },

    headerRoot: {
      height: '22vh',
      minHeight: 205,
      display: 'flex',
    },

    posterRoot: {
      height: '60vh',
      minHeight: 205,
      display: 'flex',
    },

    customRoot: {
      height: '50vh',
      minHeight: 205,
      display: 'flex',
    },

    defaultContainer: {
      ...flexContainerStyles, 
      marginTop: 0,
      marginBottom: theme.spacing(7),
      maxWidth: 'inherit',
    },

    pageContainer: {
      marginBottom: theme.spacing(7),
      marginTop: '21vh',
      float: 'left',
      marginLeft: 40, 
      width: 815,
      [theme.breakpoints.down('md')]: {
        ...flexContainerStyles, 
        marginLeft: 70, 
        width: '85%'
      }, 
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0, 
        width: 'auto'
      },
      [theme.breakpoints.down('xs')]: {
        marginTop: '15vh', 
        width: 'auto'
      }
    },

    posterContainer: {
      ...flexContainerStyles, 
      marginTop: 0,
      marginBottom: theme.spacing(20),
      maxWidth: 'inherit',
    },

    customContainer: {
      ...flexContainerStyles, 
      marginTop: 0,
      maxWidth: 'inherit',
    },

    backdrop: {
      ...backgroundStyles,
      backgroundColor: theme.palette.common.black,
      opacity: 0.5,
      zIndex: -1,
    },

    background: {
      ...backgroundStyles,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      zIndex: -2,
    }
  }))(props); 
}