import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 260;
export const useStyles = makeStyles(theme => ({
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },

    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },

    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },

    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    menuButton: {
      marginRight: 36,
    },

    menuButtonHidden: {
      display: "none",
    },

    title: {
      flexGrow: 1,
    },

    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(6),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(8),
      },
    },

    appBarSpacer: theme.mixins.toolbar,

    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    },

    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },

    fixedHeight: {
      height: 325,
      [theme.breakpoints.down('sm')]: {
        height: 250
      }
    },

    seeMore: {
      marginTop: theme.spacing(3),
    }

  }))