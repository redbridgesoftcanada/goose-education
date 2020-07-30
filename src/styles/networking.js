import { makeStyles } from '@material-ui/core/styles';

export const useStyles = props => {
  return makeStyles(theme => ({
    header: {
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 2)
      }
    },
    
    headerTitle: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2)
    },

    headerDescription: {
      ...theme.typography.body1,
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        ...theme.typography.body2
      }
    },

    panel: {
      marginTop: theme.spacing(3)
    },

    // A R T I C L E  B O A R D 
    root: {
      overflow: 'hidden'
    },

    board: {
      marginTop: theme.spacing(7)
    },

    article: {
      color: theme.palette.common.black,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.secondary.main,
        textDecoration: 'none'
      }
    },

    articleThumbnail: {
      height: 200
    },

    articleTitle: {
      ...theme.typography.body1,
      fontWeight: 700,
    },

    articleDescription: {
      ...theme.typography.body2,
      margin: theme.spacing(1, 0),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }))(props);
}