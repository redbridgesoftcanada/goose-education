import { makeStyles } from '@material-ui/core/styles';

export const buttonStyles = props => {
  return makeStyles(theme => ({
    root: {
      float: 'left',
      marginRight: theme.spacing(1),
      '& .MuiButton-startIcon': {
          [theme.breakpoints.down('sm')]: {
              marginRight: 0
          }
      }
    },

    popoverItem: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.secondary.main,
        },
      }
    },

    search: {
      float: 'right',
      border: `2px solid ${theme.palette.secondary.main}`,
      borderRadius: '5px',
      paddingLeft: theme.spacing(1),
    },

    condenseContainer: {
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(7)
      }
    },

    condenseSearch: {
      float: 'right',
      '& .MuiButton-startIcon': {
        [theme.breakpoints.down('xs')]: {
            marginRight: 0
        }
      }
    },

  }))(props);
}