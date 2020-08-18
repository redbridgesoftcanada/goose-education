import { makeStyles } from '@material-ui/core/styles';

export const announcementStyles = props => {
  return makeStyles(theme => ({
    image: {
      display: 'block',
      border: '0',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
    },

    // single announcement
    title: {
      ...theme.typography.h6,
      marginTop: theme.spacing(3),
      textAlign: 'left'
    },

    metaContainer: {
      padding: theme.spacing(1, 0),
      flexDirection: 'row'
    },

    metaLeft: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },

    metaRight: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start'
    },

    announceContainer: {
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    announceActions: {
      marginTop: theme.spacing(2),
    },

    announceButtons: {
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.main,
      }
    },

    announceSocialButtons: {
      paddingTop: 0,
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.main,
      }
    },

    metaText: {
      ...theme.typography.caption
    },

    commentHeader: {
      ...theme.typography.body1,
      textAlign: 'left',
      marginTop: theme.spacing(2)
    },

    commentButton: {
      marginBottom: theme.spacing(1)
    },
  }))(props);
}