import { makeStyles } from '@material-ui/core/styles';

export const appBarStyles = (props, stylesheet) => {
  const isNavBar = stylesheet === 'navbar';
  return makeStyles(theme => ({
    appBar: {
      color: theme.palette.common.white,
      ...isNavBar ? { position: 'static' } : { position: 'sticky' }
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
      ...isNavBar && {
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
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
      color: theme.palette.common.black,
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.main
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
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      }
    },

    icon: {
      color: theme.palette.common.black,
      '&:hover': {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.secondary.main,
        fill: theme.palette.secondary.main
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