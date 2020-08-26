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
      marginTop: '10vh'
    },

    footer: {
      maxHeight: '16vh'
    },

    // F O R M
    formTitle: {
      ...theme.typography.h4,
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        ...theme.typography.h5,
        fontWeight: 600
      }
    },

    stepButtons: {
      marginBottom: theme.spacing(1)
    },

    formFields: {
      justifyContent: 'center'
    },

    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 300,
      },
    },

    error: {
      ...theme.typography.body2,
      color: theme.palette.secondary.main
    },

    button: {
      "&:hover": {
        backgroundColor: "transparent"
      }
    },

    gooseTermsAndConditions: {
      display: 'inline-flex'
    },

    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    }
  }))(props);
}