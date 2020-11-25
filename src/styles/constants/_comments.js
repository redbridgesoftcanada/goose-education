import { makeStyles } from '@material-ui/core/styles';

export const commentStyles = props => {
  return makeStyles(theme => ({
    container: {
      marginTop: theme.spacing(2)
    },
    
    fsContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center'
    },

    feContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center'
    },

    metaAuthor: {
      ...theme.typography.caption,
      fontWeight: 600
    },

    metaDate: {
      ...theme.typography.caption
    },

    commentText: {
      ...theme.typography.body2,
      textAlign: 'left'
    },

    commentButton: {
      marginBottom: theme.spacing(1)
    }

  }))(props)
}