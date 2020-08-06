import { makeStyles } from '@material-ui/core/styles';

export const validationsStyles = () => {
  return makeStyles(theme => ({
    legend: {
      textAlign: 'left',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    },
    

    snackBar: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.main
    },

    snackBarMessage: {
      ...theme.typography.body2,
      color: theme.palette.secondary.main
    },

    error: {
      color: theme.palette.secondary.main,
      fontSize: '0.75rem',
      margin: theme.spacing(1, 2, 0),
      textAlign: 'left'
    }

  }));
}