import { makeStyles } from '@material-ui/core/styles';

export const schoolApplicationStyles = props => {
  return makeStyles(theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },

    legend: {
      textAlign: 'left',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    },
  }))(props);
}