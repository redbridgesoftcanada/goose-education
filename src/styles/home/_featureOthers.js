import { makeStyles } from '@material-ui/core/styles';

export const featureOthersStyles = props => {
  return makeStyles(theme => ({
    root: {
      overflow: 'hidden',
    },

    header: {
        display: 'flex',
        justifyContent: 'center',
    },

    container: {
        marginBottom: theme.spacing(3),
    },

    titleLeft: {
        marginTop: theme.spacing(7),
    },
    
    titleRight: {
        color: theme.palette.common.white,
        marginTop: theme.spacing(7),
    },

    item: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
        textAlign: 'left'
    },

    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '25%',
        height: 'auto',
        margin: '0px auto',
    },

    description: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3, 2),
        "&:hover": {
            cursor: 'pointer'
        },
    },

    rightBackground: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.custom.red,
    },

    button: {
        marginTop: theme.spacing(5),
        "&:hover": {
            backgroundColor: "transparent"
        }
    },

    buttonWhite: {
        color: theme.palette.common.white,
        marginTop: theme.spacing(5),
        "&:hover": {
            backgroundColor: "transparent"
        },
    }

  }))(props);
}