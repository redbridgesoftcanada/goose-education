import { makeStyles } from '@material-ui/core/styles';

export const featureInstagramStyles = props => {
  return makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.secondary.light,
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
        boxShadow: '0 0 0 2px white',
        border: '2px solid white'
      },
      height: 350,
      backgroundPosition:'center', 
      backgroundSize:'cover',
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