import { makeStyles } from '@material-ui/core/styles';

export const tipsStyles = () => {
  return makeStyles(theme => ({
    title: {
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(2),
    },
    
    board: {
      marginTop: theme.spacing(7)
    },

    tipThumbnail: {
      height: 200
    },

    tip: {
      color: theme.palette.common.black,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.secondary.main,
        cursor: 'pointer',
        textDecoration: 'none',
      }
    },

    metaContainer: {
      padding: theme.spacing(1, 0),
      flexDirection: 'row'
    },

    tipImage: {
      height: 300,
      marginTop: theme.spacing(2)
    },

  }))()
}