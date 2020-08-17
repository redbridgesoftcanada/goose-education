import { makeStyles } from '@material-ui/core/styles';

export const announcementStyles = props => {
  return makeStyles(theme => ({
    mt3: {
      marginTop: theme.spacing(3),
    },

    title: {
      ...theme.typography.h6,
      textAlign: 'left'
    },

    pr1: {
      ...theme.typography.body2,
      paddingRight: theme.spacing(1),
    },

    meta: {
      background: theme.palette.secondary.light,
      color: 'rgba(0, 0, 0, 0.54)',
      opacity: 0.9,
      paddingBottom: theme.spacing(5),
    },

    left: {
      float: 'left',
      display: 'flex',
      justifyContent: 'space-evenly'
    },

    right: {
      float: 'right',
      display: 'flex',
    },

    image: {
      display: 'block',
      border: '0',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
    },

    description: {
      ...theme.typography.body1,
      textAlign: 'left',
      marginTop: theme.spacing(2),
      paddingBottom: theme.spacing(5),
    }
  }))(props);
}