import { makeStyles } from '@material-ui/core/styles';

export const studyAbroadStyles = props => {
  return makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },

    // C O R E  F E A T U R E S
    container: {
      overflow: 'hidden',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(9)
    },

    headerTitle: {
      ...theme.typography.h4
    },

    headerSubtitle: {
      ...theme.typography.body1
    },

    image: {
      width: 200,
      height: 'auto',
      margin: '0px auto',
    },

    // P L A T F O R M
    wrapper: {
      marginTop: theme.spacing(15)
    },

    frontWrapper: {
      zIndex: 1,
    },

    backWrapper: {
      position: 'relative',
    },

    frontCard: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme.palette.secondary.light,
      padding: theme.spacing(8, 3),
    },

    backCard: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      padding: theme.spacing(8, 10),
    },

    behind: {
      position: 'absolute',
      top: -67,
      left: -67,
      right: 0,
      bottom: 0,
      width: '135%',
    },

    backContent: {
      color: theme.palette.common.white,
    },

  }))(props);
}