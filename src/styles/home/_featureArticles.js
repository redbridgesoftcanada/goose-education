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
      color: theme.palette.common.white,
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(2),
    },

    description: {
      color: theme.palette.common.white,
    },

    button: {
      color: theme.palette.common.white,
      marginTop: theme.spacing(5)
    },

    imageWrapper: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(15),
        display: 'flex',
        position: 'relative',
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