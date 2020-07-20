import { makeStyles } from '@material-ui/core/styles';

export const footerStyles = props => {
  return makeStyles(theme => ({ 
    root: {
      backgroundColor: theme.palette.secondary.light,
      padding: `${theme.spacing(3)}px 0px`,
      alignItems: 'center',
      flexWrap: 'nowrap',
      overflow: 'hidden'
    },
    leftWrapper: {
      marginLeft: theme.spacing(5),
      alignItems: 'center'
    },
    list: {
      fontSize: 13,
      listStyle: 'none',
      textAlign: 'left'
    },
    listItem: {
      marginTop: theme.spacing(1)/4
    },
    linkHover: {
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
    rightWrapper: {
      marginRight: theme.spacing(5),
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    icon: {
      width: 48,
      height: 48,
      backgroundColor: theme.palette.custom.red,
      marginRight: theme.spacing(1),
      '&:hover': {
        backgroundColor: theme.palette.common.white,
      }
    },
    copyright: {
      marginTop: theme.spacing(1)
    }
  }))(props);
}