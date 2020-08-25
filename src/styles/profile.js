import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => {
  return makeStyles(theme => ({
    avatarContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    
    avatar: {
      width: theme.spacing(10), 
      height: theme.spacing(10)
    },

    submitButton: {
      marginTop: theme.spacing(4)
    },
  }))(props);
}

export default useStyles;