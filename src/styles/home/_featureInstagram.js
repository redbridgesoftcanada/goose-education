import { makeStyles } from '@material-ui/core/styles';

export const featureInstagramStyles = props => {
  return makeStyles(theme => ({
    root: {
      overflow: 'hidden',
      marginBottom: theme.spacing(2)
    },

    header: {
      ...theme.typography.h4,
      marginTop: theme.spacing(5),
    },

    container: {
      marginTop: theme.spacing(2),
      display: 'flex',
      position: 'relative',
    },

    image: {
      "&:hover": {
          cursor: 'pointer',
      },
      height: 350,
      backgroundPosition:'center', 
      backgroundSize:'contain',
    },

    cardContent: {
      height: 150,
      [theme.breakpoints.down('sm')]: {
        padding: '10px 16px 0 16px'
      }
    },

    caption: {
      ...theme.typography.subtitle2,
      maxWidth: 350
    }
    
  }))(props);
}