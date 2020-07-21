import { makeStyles } from '@material-ui/core/styles';

export const pageBannerLayoutStyles = props => {
  const isPageBanner = props.layoutType === 'pageBanner';
  
  const flexContainerStyles = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
  const backgroundStyles = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }; 
  
  return makeStyles(theme => ({
    root: {
      alignItems: 'center',
      color: theme.palette.common.white,
      height: !isPageBanner ? '22vh' : '80vh',
      minHeight: !isPageBanner ? 205 : 500,
      maxHeight: 1300,
      position: 'relative',
      ...!isPageBanner && { display: 'flex' },
      ...isPageBanner && {
        [theme.breakpoints.down('sm')]: { 
          height: '40vh'
        }
      }
    },

    container: {
      marginBottom: theme.spacing(14),
      marginTop: !isPageBanner ? 0 : '21vh',
      ...!isPageBanner && { ...flexContainerStyles, maxWidth: 'inherit' },
      ...isPageBanner &&  { 
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
      }
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