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

    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      maxWidth: 285,
    },

    title: {
      textAlign: 'center'
    },

    menu: {
      margin: theme.spacing(1, 0),
      width: 200,
    },

    filterSearch: {
      width: '80%',
      padding: theme.spacing(1, 1)
    },

    button: {
      margin: theme.spacing(1)
    },
  
    toolTipHeader: {
      marginTop: theme.spacing(8)
    },

    toolTipButton: {
      width: 55,
      height: 55,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      marginRight: theme.spacing(1),
      "&:hover": {
        backgroundColor: "transparent",
        color: theme.palette.secondary.main,
        fill: theme.palette.secondary.main
      }
    },

  }))(props);
}