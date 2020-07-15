import { makeStyles } from '@material-ui/core/styles';

export const navButtonBaseStyles = classes => {
  return makeStyles(theme => ({
    root: {
      maxWidth: '100%',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(4),
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    column: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
    imageWrapper: {
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
    imageButton: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background: theme.palette.common.black,
      opacity: 0.5,
      transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
      position: 'relative',
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
    },
    imageDescription: {
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
      textAlign: 'left',
    },
    imageMarked: {
      height: 3,
      width: 18,
      background: theme.palette.common.white,
      position: 'absolute',
      bottom: -2,
      left: 'calc(50% - 9px)',
      transition: theme.transitions.create('opacity'),
    },
  }))(classes);
}