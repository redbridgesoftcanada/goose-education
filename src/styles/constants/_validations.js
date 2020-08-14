import { makeStyles } from '@material-ui/core/styles';

export const validationsStyles = () => {
  return makeStyles(theme => ({
    error: {
      color: theme.palette.secondary.main,
      fontSize: '0.75rem',
      margin: theme.spacing(1, 2, 0),
      textAlign: 'left'
    }

  }));
}