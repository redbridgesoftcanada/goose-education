import { makeStyles } from '@material-ui/core/styles';

export const useStyles = props => {
  return makeStyles(theme => ({

    // P A R E N T 
    // (positional styling for shorter page content)
    container: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '92vh',
      [theme.breakpoints.down('sm')]: {
        minHeight: '90vh'
      }
    },

    form: {
      marginTop: '20vh'
    },

    footer: {
      maxHeight: '16vh'
    },

    // C O N T E N T 
    formTitle: {
      ...theme.typography.h4,
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        ...theme.typography.h6
      }
    },

    formSubtitle: {
      ...theme.typography.body1
    },

    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 300,
      },
    },

  }))(props);
}