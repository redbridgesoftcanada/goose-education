// Material UI dashboard template
// https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard

import React, { useReducer } from "react";
import clsx from "clsx";
import { AppBar, Badge, Box, Button, Container, Divider, Drawer, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Snackbar,  Toolbar, Typography, makeStyles } from "@material-ui/core";
import { ChevronLeft, Menu as MenuIcon, Notifications, Dashboard, People, Layers, Assignment, AirplanemodeActive, Home, School, Settings, QuestionAnswer, NewReleases, Description, LiveHelp } from "@material-ui/icons";
import { ADMIN_PAGES } from "../constants/constants";
import Chart from "../components/material-ui/Chart";
import Deposits from "../components/material-ui/Deposits";
import TableTemplate from "../components/material-ui/TableTemplate";
import AdminComposeDialog from '../components/admin/AdminComposeDialog';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.gooseedu.com/">
        Goose Education
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 260;
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
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
  container: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

function loadMenuIcons(page) {
  switch (page) {
    case "Overview":
      return <Dashboard/>
    case "Users":
      return <People/>
    case "Schools":
      return <School/>
    case "Applications":
      return <Layers/>
    case "Homestays":
      return <Home/>
    case "Airport Rides":
      return <AirplanemodeActive/>
    case "Goose Tips":
      return <LiveHelp/>
    case "Articles":
      return <Description/>
    case "Announcements":
      return <NewReleases/>
    case "Messages":
      return <QuestionAnswer/>
    default:
      return <Settings/>
  }
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case "TOGGLE_DRAWER":
      return { ...state, drawerOpen: !state.drawerOpen }
    
    case "TOGGLE_CONTENT":
      return { ...state, selectedContent: payload }

    case 'TOGGLE_COMPOSE_DIALOG':
      return {...state, composeDialogOpen: !state.composeDialogOpen}  

    case "COMPOSE_ANCHOR":
      return { ...state, composeMenuAnchor: payload }

    case "COMPOSE_FORM":
      const selectedMenu = payload.id;
      if (selectedMenu) {
        // set composeForm property for <AdminComposeDialog> component
        return { ...state, composeFormType: selectedMenu, composeDialogOpen: true, composeMenuAnchor: null }  
      } else {
        // nothing chosen;
        return { ...state, composeFormType: null, composeDialogOpen: false, composeMenuAnchor: null }
      }

    case 'SNACKBAR_OPEN':
      return {...state, snackbarOpen: !state.snackbarOpen, snackbarMessage: payload}      
  
    default:
      console.log("No matching reducer type in Admin Dashboard.");
  }
}

export default function AdminDashboard() {
  // S T A T E
  const INITIAL_STATE = {
    drawerOpen: true,
    selectedContent: ADMIN_PAGES[0],
    composeMenuAnchor: null,
    composeFormType: null,
    composeDialogOpen: false,
    snackbarOpen: false,
    snackbarMessage: null
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  // D I S P A T C H  M E T H O D S
  const toggleDrawer = () => dispatch({type: "TOGGLE_DRAWER"});
  const toggleDisplayContent = event => dispatch({type: "TOGGLE_CONTENT", payload: event.currentTarget.id});
  const toggleComposeDialog = () => dispatch({type: 'TOGGLE_COMPOSE_DIALOG'});

  const setComposeMenu = event => dispatch({type: "COMPOSE_ANCHOR", payload: event.currentTarget});
  const setComposeForm = event => dispatch({type: "COMPOSE_FORM", payload: event.currentTarget});
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});

  // S T Y L I N G 
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar, state.drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            className={clsx(classes.menuButton, state.drawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Goose Education
          </Typography>
          
          {/* C R E A T E */}
          <Button variant="outlined" color="secondary" onClick={setComposeMenu}>Create</Button>
          <Menu
            keepMounted
            anchorEl={state.composeMenuAnchor}
            open={Boolean(state.composeMenuAnchor)}
            onClose={setComposeForm}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            disableScrollLock
          >
            <MenuItem id="school" onClick={setComposeForm}>New School</MenuItem>
            <MenuItem id="tip" onClick={setComposeForm}>New Tip</MenuItem>
            <MenuItem id="article" onClick={setComposeForm}>New Article</MenuItem>
            <MenuItem id="announce" onClick={setComposeForm}>New Announcement</MenuItem>
          </Menu>

          <AdminComposeDialog formType={state.composeFormType} isEdit={false} open={state.composeDialogOpen} onClose={toggleComposeDialog} setSnackbarMessage={setSnackbarMessage}/>

          {/* N O T I F I C A T I O N S */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={state.snackbarOpen}
            autoHideDuration={1000}
            onClose={() => setSnackbarMessage(null)}
            message={state.snackbarMessage}/>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !state.drawerOpen && classes.drawerPaperClose),
        }}
        open={state.drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          {ADMIN_PAGES.map((page, i) => {
            return (
            <ListItem button key={i} id={page} onClick={toggleDisplayContent}>
              <ListItemIcon>
                {loadMenuIcons(page)}
              </ListItemIcon>
              <ListItemText primary={page} />
            </ListItem>
          )})}
        </List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
            
            {state.selectedContent === "Overview" ?
            <>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Deposits />
                </Paper>
              </Grid>
            </>
          :
            <Grid item xs={12}>
              <Paper>
                <TableTemplate type={state.selectedContent} snackbarMessage={setSnackbarMessage}/>
              </Paper>
            </Grid>
          }

            </Grid>
          </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
      

    </div>
  );
}