// Material UI dashboard template
// https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard

import React, { useReducer } from "react";
import clsx from "clsx";
import { AppBar, Badge, Box, Container, Divider, Drawer, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Toolbar, Typography, makeStyles } from "@material-ui/core";
import { ChevronLeft, Menu, Notifications, Dashboard, People, Layers, Assignment, AirplanemodeActive, Home, School, Settings } from "@material-ui/icons";
import { ADMIN_PAGES, NAV_PAGES } from "../constants/constants";
import Chart from "../components/material-ui/Chart";
import Deposits from "../components/material-ui/Deposits";
import TableTemplate from "../components/material-ui/TableTemplate";

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
    case "Homestay":
      return <Home/>
    case "Airport Rides":
      return <AirplanemodeActive/>
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
  
    default:
      console.log("No matching reducer type in Admin Dashboard.");
  }
}

export default function AdminDashboard(props) {
  
  // S T A T E
  const INITIAL_STATE = {
    drawerOpen: true,
    selectedContent: ADMIN_PAGES[0],
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { drawerOpen, selectedContent } = state;

  // D I S P A T C H  M E T H O D S
  const toggleDrawer = () => dispatch({type: "TOGGLE_DRAWER"});
  const toggleDisplayContent = event => dispatch({type: "TOGGLE_CONTENT", payload: event.currentTarget.id});

  // S T Y L I N G 
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
            <Menu />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Goose Education
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
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
        <Divider />
        <List>
          {NAV_PAGES.slice(1).map((page, i) => {
            return (
            <ListItem button key={i} id={page} onClick={toggleDisplayContent}>
              <ListItemIcon>
                <Assignment/>
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
            
            {selectedContent === "Overview" ?
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
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  {/* <TableTemplate /> */}
                </Paper>
              </Grid>
            </>
          :
            <Grid item xs={12}>
              <Paper>
                <TableTemplate history={props.history} type={selectedContent}/>
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