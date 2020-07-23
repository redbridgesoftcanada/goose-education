import { makeStyles } from '@material-ui/core/styles';

export const useStyles = props => {
  return makeStyles(theme => ({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh'
    },

    form: {
      marginTop: '20vh'
    },

    footer: {
      maxHeight: '16vh'
    },

    formTitle: {
      ...theme.typography.h4,
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        ...theme.typography.h6
      }
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

    submitButton: {
      marginTop: theme.spacing(1)
    },

    forgotLink: {
      ...theme.typography.body2,
      color: theme.palette.common.black,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
      '&:focus': {
        color: theme.palette.secondary.main
      }
    },

    registerLink: {
      ...theme.typography.body2,
      color: theme.palette.common.black,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
      '&:focus': {
        color: theme.palette.secondary.main
      }
    }
  }))(props);
}