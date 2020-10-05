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
        ...theme.typography.h4,
        marginTop: theme.spacing(7),
    },
    
    titleRight: {
        ...theme.typography.h4,
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
        height: 150,
        [theme.breakpoints.down('sm')]: {
          height: 100
        }
    },

    description: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3, 2),
        "&:hover": {
            cursor: 'pointer',
            textDecoration: 'underline'
        },
    },

    rightBackground: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
    },

    button: {
        marginTop: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    buttonWhite: {
        color: theme.palette.common.white,
        marginTop: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }

  }))(props);
}