import { makeStyles } from '@material-ui/core/styles';

export const navButtonBaseStyles = props => {
    
  const absoluteStyles = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 };

  return makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },

    buttonBase: {
      position: 'relative',
      display: 'inline-block',
      padding: 0,
      borderRadius: 0,
      height: '35vh',
      [theme.breakpoints.down('sm')]: {
        width: '100% !important',
        height: 100,
      },
      '&:hover': {
        zIndex: 1,
      },
      '&:hover $imageBackdrop': {
        opacity: 0.15,
      },
      '&:hover $imageMarked': {
        opacity: 0,
      },
      '&:hover $imageTitle': {
        border: '4px solid currentColor',
      },
    },

    imageSrc: {
      ...absoluteStyles,
       backgroundSize: 'cover',
       backgroundPosition: 'center 40%',
     },

    imageBackdrop: {
    ...absoluteStyles,
      background: theme.palette.common.black,
      opacity: 0.5,
      transition: theme.transitions.create('opacity'),
    },

    imageButton: {
     ...absoluteStyles,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
    },

    imageTitle: {
      ...theme.typography.h6,
      color: theme.palette.common.white,
      position: 'relative',
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
    },

    imageDescription: {
      ...theme.typography.caption,
      padding: `0 ${theme.spacing(4)}px 14px`,
      textAlign: 'left',
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },

    imageMarked: {
      background: theme.palette.common.white,
      height: 3,
      left: 'calc(50% - 9px)',
      marginTop: 8,
      position: 'absolute',
      transition: theme.transitions.create('opacity'),
      width: 18
    }
  }))(props);
}