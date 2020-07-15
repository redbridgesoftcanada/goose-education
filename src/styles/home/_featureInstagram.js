import { makeStyles } from '@material-ui/core/styles';

export const featureInstagramStyles = props => {
  return makeStyles(theme => ({
    root: {
      overflow: 'hidden',
    },

    header: {
      display: 'flex',
      justifyContent: 'center',
    },

    title: {
      marginTop: theme.spacing(7),
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

    caption: {
      maxWidth: 350
    }
    
  }))(props);
}