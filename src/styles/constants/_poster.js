import { makeStyles } from '@material-ui/core/styles';

export const posterStyles = props => {

  return makeStyles(theme => ({     
    background: {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundPosition: '50% 35%',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      opacity: 0.9
    },

    customContainer: {
      listStyleType: 'none',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0
      }
    },

    title: {
      color: theme.palette.common.white,
      position: 'absolute'
    },

    customTitle: {
      ...theme.typography.h2,
      color: theme.palette.common.white,
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        ...theme.typography.h4,
        color: theme.palette.common.white,
        marginTop: theme.spacing(7),
      },
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(2),
        marginBottom: 0
      }
    },

    subtitle: {
      ...theme.typography.subtitle1,
      color: theme.palette.common.white,
      position: 'absolute',
      textAlign: 'center',
      width: '85%',
    },

    defaultSubtitle: {
      marginTop: 70,
      [theme.breakpoints.down('xs')]: {
        ...theme.typography.subtitle2
      }
    },

    customSubtitle: {
      ...theme.typography.subtitle2,
      marginTop: theme.spacing(5),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      },
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        marginTop: theme.spacing(4),
        position: 'inherit',
        width: '100%'
      }
    },

    caption: {
      ...theme.typography.body2,
      textAlign: 'center',
      color: theme.palette.common.white,
      position: 'absolute',
      width: '85%',
    },

    defaultCaption: {
      marginTop: 130,
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },

    customVanCaption: {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      },
      [theme.breakpoints.between('xs', 'sm')]: {
        width: '100%'
      },
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        marginTop: 10,
        width: '95%'
      }
    },

    customStudyCaption: {
      marginTop: 80,
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },

    posterCards: {
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },

    cardTitle: {
      color: theme.palette.secondary.main,
      [theme.breakpoints.down('md')]: {
        fontSize: 14
      }
    },

    cardCaption: {
      ...theme.typography.body2,
      [theme.breakpoints.down('sm')]: {
        ...theme.typography.caption
      }
    },

    bullet: {
      color: theme.palette.secondary.main,
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(1.5)'
    },

  }))(props);
}
