import { makeStyles } from '@material-ui/core/styles';

export const posterStyles = props => {
  const isCustomPoster = props.layoutType === 'vancouver_now';

  return makeStyles(theme => ({     
    background: {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundPosition: '50% 35%',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      opacity: 0.9
    },

    title: {
      color: theme.palette.common.white,
      position: 'absolute',
      ...isCustomPoster && { marginTop: 140 },
    },

    subtitle: {
      ...theme.typography.subtitle1,
      color: theme.palette.common.white,
      position: 'absolute',
      marginTop: isCustomPoster ? 100 : 70,
      textAlign: 'center',
      width: '85%',
      [theme.breakpoints.down('xs')]: {
        ...theme.typography.subtitle2
      }
    },

    caption: {
      ...theme.typography.body2,
      textAlign: 'center',
      color: theme.palette.common.white,
      position: 'absolute',
      marginTop: isCustomPoster ? 220 : 130,
      width: '85%',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },

    bullet: {
      color: theme.palette.secondary.main,
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(1.5)',
    },

  }))(props);
}