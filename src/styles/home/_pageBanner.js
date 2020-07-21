import { makeStyles } from '@material-ui/core/styles';

export const pageBannerStyles = props => {
  const isPageBanner = props.layoutType === 'pageBanner';
  
  return makeStyles(theme => ({
    background: {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundPosition: 'center',
    },

    headerTitle: {
      color: theme.palette.common.white,
      marginTop: isPageBanner ? 90 : 20,
      position: 'absolute',
      textAlign: 'center',
    },

    pageBannerTitle: {
      color: theme.palette.common.white,
      textAlign: 'left',
      [theme.breakpoints.down('md')]: { 
        textAlign: 'center' 
      }
    },
    
    pageBannerCaption: {
      color: theme.palette.common.white,
      margin: `${theme.spacing(2)}px 0`,
      textAlign: 'left',
      ...theme.typography.body1,
      [theme.breakpoints.down('md')]: { 
        textAlign: 'center' 
      },
      [theme.breakpoints.down('sm')]: { 
        display: 'none' 
      }
    },

    pageBannerButton: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      [theme.breakpoints.down('sm')]: { 
        marginTop: theme.spacing(2) 
      }
    },

    h5: {
      margin: `${theme.spacing(4)}px 0`,
      [theme.breakpoints.up('sm')]: { 
        marginTop: theme.spacing(10) 
      },
    }
  }))(props);
}