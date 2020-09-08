import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => {
  return makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },

    menu: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  
    image: {
      height: 150,
      [theme.breakpoints.down('sm')]: {
        height: 100
      }
    },

    meta: {
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },

    icon: {
      marginRight: 3
    },

    card: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
      textAlign: 'left',
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },

    summary: {
      padding: theme.spacing(1),
    },
  
    description: {
      [theme.breakpoints.down('md')]: {
        whiteSpace: 'nowrap',
        overflow: 'hidden', 
        textOverflow: 'ellipsis'
      }
    },

    noMatchError: {
      paddingTop: theme.spacing(2)
    },
  }))(props);
}

export default useStyles;