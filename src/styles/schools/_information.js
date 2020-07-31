import { makeStyles } from '@material-ui/core/styles';

export const schoolInformationStyles = props => {
  return makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },

    applicationError: {
      ...theme.typography.h5,
      paddingTop: theme.spacing(10)
    },

    // L I S T  O F  S C H O O L S
    sectionRoot: {
      overflow: 'hidden',
      marginTop: '25px',
      '&$.MuiCardMedia-img': {
        objectFit: 'contain'
      }
    },

    counter: {
      ...theme.typography.body2
    },

    image: {
      height: 130,
      objectFit: 'contain',
    },

    grid: {
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      textAlign: 'left',
      cursor: 'pointer',
    },

    school: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1, 0),
      '&:hover': {
        color: theme.palette.secondary.main,
      }
    },

    schoolTitle: {
      ...theme.typography.h6,
      color: 'inherit',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 16
      }
    },

    schoolDescription: {
      ...theme.typography.body2,
      color: 'inherit',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        whiteSpace: 'nowrap',
        overflow: 'hidden', 
        textOverflow: 'ellipsis'
      }
    },
    
    badge: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      padding: '3px',
      width: '8em',
      fontSize: '12px',
      fontWeight: 600,
      textAlign: 'center',
      textTransform: 'uppercase'
    }
  }))(props)
}