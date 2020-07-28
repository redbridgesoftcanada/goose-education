import { makeStyles } from '@material-ui/core/styles';

export const studyAbroadStyles = props => {
  return makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }))(props);
}