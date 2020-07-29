import { makeStyles } from '@material-ui/core/styles';

export const buttonStyles = props => {
  return makeStyles(theme => ({
    root: {
      float: 'left',
      marginRight: theme.spacing(1),
      "& .MuiButton-startIcon": {
          [theme.breakpoints.down('sm')]: {
              marginRight: 0
          }
      }
    },
  }))(props);
}