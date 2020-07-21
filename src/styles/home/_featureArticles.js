import { makeStyles } from '@material-ui/core/styles';

export const featureArticlesStyles = props => {
  return makeStyles(theme => ({
    root: {
      overflow: 'hidden',
      backgroundColor: theme.palette.primary.dark,
    },

    header: {
      display: 'flex',
      justifyContent: 'center',
    },
    
    title: {
      ...theme.typography.h4,
      color: theme.palette.common.white,
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(2),
    },

    description: {
      ...theme.typography.body2,
      color: theme.palette.common.white,
      [theme.breakpoints.down('sm')] : {
        width: '75%',
        marginLeft: '12%'
      }
    },

    button: {
      color: theme.palette.common.white,
      marginTop: theme.spacing(5),
      [theme.breakpoints.down('sm')]: { 
        display: 'none'
      }
    },

    imageWrapper: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(15),
    },

    image: {
      display: 'block',
      border: '0',
      width: 'auto',
      maxWidth: '100%',
      height: 'auto',
      margin: '0px auto',
      "&:hover": {
        cursor: 'pointer',
      }
    }
  }))(props);
}