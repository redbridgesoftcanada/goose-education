import { makeStyles } from '@material-ui/core/styles';

export const appBarStyles = (props, stylesheet) => {
  return makeStyles(theme => ({
    appBar: {
      color: theme.palette.common.white,
      ...(stylesheet === 'navbar') ? { position: 'static' } : { position: 'sticky' }
    },

    toolbar: {
      height: 64,
      [theme.breakpoints.up('sm')]: {
        height: 70,
      },
      [theme.breakpoints.down('xs')]: {
        height: 115,
      },
    },
    
    container: {
      alignItems: 'center',
      justifyContent: 'space-between',
      ...(stylesheet === 'navbar') && {
        [theme.breakpoints.down('xs')]: {
          justifyContent: 'center'
        }
      }
    },

    // N A V B A R  S T Y L E S
    logo: {
      marginLeft: theme.spacing(2)
    },

    title: {
      ...theme.fontHeader,
      ...theme.typography.h6,
      fontSize: 24,
      '&:hover': {
        textDecoration: 'none'
      },
    },

    navlinks: {
      [theme.breakpoints.down('md')]: {
        display: 'none'
      },
    },

    navlinkItem: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: theme.palette.secondary.main
      },
    },

    link: {
      ...theme.fontHeader,
      ...theme.typography.h6,
      fontSize: 14,
      color: theme.palette.common.black,
      '&:hover': {
        textDecoration: 'none',
      },
    },

    linkSecondary: {
      ...theme.fontHeader,
      ...theme.typography.h6,
      fontSize: 14,
      color: theme.palette.secondary.main,
      '&:hover': {
        textDecoration: 'none',
      },
    },

    // H E A D E R  B A R  S T Y L E S
    iconButtons: {
      float: 'left',
      color: theme.palette.common.black,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      }
    },

    customKakao: {
      width: 24,
      height: 30
    },

    customNaver: {
      width: 29,
      height: 30
    },

    search: {
      float: 'left',
      marginTop: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },

    searchBar: {
      marginLeft: theme.spacing(2),
    },

    searchBarInput: {
      height: theme.spacing(5)
    },

    navDrawerMenuItems: {
      paddingLeft: theme.spacing(4)
    },
  }))(props);
}