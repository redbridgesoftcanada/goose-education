import { makeStyles } from '@material-ui/core/styles';

export const footerStyles = props => {
  return makeStyles(theme => ({ 
    root: {
      alignItems: 'center',
      flexWrap: 'nowrap',
      overflow: 'hidden'
    },

    condenseWrapper: {
      alignItems: 'center',
      flexDirection: 'column'
    },

    leftWrapper: {
      alignItems: 'center',
      marginLeft: theme.spacing(5),
      [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(2)
      }
    },

    list: {
      fontSize: 13,
      listStyle: 'none',
      textAlign: 'left'
    },

    listItem: {
      marginTop: theme.spacing(1) / 4
    },

    linkHover: {
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },

    rightWrapper: {
      alignItems: 'flex-end',
      flexDirection: 'column',
      marginRight: theme.spacing(5),
      [theme.breakpoints.down('md')]: {
        marginRight: theme.spacing(2)
      }
    },

    icon: {
      width: 48,
      height: 48,
      backgroundColor: theme.palette.common.white,
      marginRight: theme.spacing(1),
      '&:hover': {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.secondary.main,
        fill: theme.palette.secondary.main
      }
    },

    copyright: {
      marginTop: theme.spacing(1),
      textAlign: 'right',
      [theme.breakpoints.down('sm')]: {
        marginTop: 0,
        textAlign: 'center'
      }
    }

  }))(props);
}