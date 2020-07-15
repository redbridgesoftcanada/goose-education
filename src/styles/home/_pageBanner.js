import { makeStyles } from '@material-ui/core/styles';

export const pageBannerStyles = props => {
  const isPageBanner = props.layoutType === 'pageBanner';
  return makeStyles(theme => ({
    background: {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundPosition: 'center',
    },

    headerTitle: {
      position: 'absolute',
      textAlign: 'center',
      color: theme.palette.common.white,
      ...isPageBanner ? { marginTop: 90 } : { marginTop: 20 }
    },

    pageBannerTitle: {
      color: theme.palette.common.white,
      textAlign: 'left',
    },
    
    pageBannerCaption: {
      color: theme.palette.common.white,
      textAlign: 'left',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },

    h5: {
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(4),
      [theme.breakpoints.up('sm')]: { marginTop: theme.spacing(10) },
    }
  }))(props);
}