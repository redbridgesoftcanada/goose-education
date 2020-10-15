// Material UI dashboard template
// https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard

import React, { useReducer } from "react";
import clsx from "clsx";
import { AppBar, Box, Button, CircularProgress, Divider, Drawer, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Snackbar,  Toolbar, Typography } from "@material-ui/core";
import { ChevronLeft, Menu as MenuIcon, Dashboard, People, Layers, AirplanemodeActive, Home, School, Settings, QuestionAnswer, NewReleases, Description, LiveHelp } from "@material-ui/icons";
import { DatabaseContext } from '../components/database';
import { ADMIN_PAGES } from "../constants/constants";
import { convertToSentenceCase } from "../constants/helpers/_features";
import ChartTemplate from "../components/admin/ChartTemplate";
import PreviewTemplate from "../components/admin/PreviewTemplate";
import TableTemplate from "../components/admin/TableTemplate";
import AdminComposeDialog from '../components/admin/AdminComposeDialog';
import { useStyles } from '../styles/adminDashboard';

const INITIAL_STATE = {
  drawerOpen: true,
  selectedContent: ADMIN_PAGES[0],
  composeMenuAnchor: null,
  composeFormType: null,
  composeDialogOpen: false,
  snackbarOpen: false,
  snackbarMessage: null
}

const LoadingFallbackComponent = 
  <Grid container justify="center" alignItems="center">
    <CircularProgress color="secondary"/>
  </Grid> 

export default function AdminDashboard() {
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  const toggleDrawer = () => dispatch({type: "TOGGLE_DRAWER"});
  const toggleDisplayContent = (event, adminPageQuery) => dispatch({type: "TOGGLE_CONTENT", payload: { selectedContent: event.currentTarget.id, adminPageQuery }});
  const toggleComposeDialog = () => dispatch({type: 'TOGGLE_COMPOSE_DIALOG'});

  const setComposeMenu = event => dispatch({type: "COMPOSE_ANCHOR", payload: event.currentTarget});
  const setComposeForm = event => dispatch({type: "COMPOSE_FORM", payload: event.currentTarget});
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Box display='flex'>
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

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={state.snackbarOpen}
            autoHideDuration={1500}
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
              <DatabaseContext.Consumer key={i}>
                {({ adminPageQuery }) => 
                  <ListItem button id={page} onClick={event => toggleDisplayContent(event, adminPageQuery)}>
                    <ListItemIcon>
                      {loadMenuIcons(page)}
                    </ListItemIcon>
                    <ListItemText primary={page} />
                  </ListItem>
                }
              </DatabaseContext.Consumer>
            )})}
        </List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
          <Box pt={5} mx={5}>
            <Grid container spacing={3}>
            
            {state.selectedContent === "Overview" ?
              <DatabaseContext.Consumer>
                {({ state }) => generateAggregateCharts(fixedHeightPaper, state.adminAggregates, state.previewMessages)}
              </DatabaseContext.Consumer>
              :
              <Grid item xs={12}>
                <Paper>
                  <TableTemplate type={state.selectedContent} snackbarMessage={setSnackbarMessage}/>
                </Paper>
              </Grid>
            }
            </Grid>
          </Box>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </Box>
  );
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case "TOGGLE_DRAWER":
      return { ...state, drawerOpen: !state.drawerOpen }
    
    case "TOGGLE_CONTENT":
      const { selectedContent, adminPageQuery } = payload;
      adminPageQuery(selectedContent);
      return { ...state, selectedContent }

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

function generateAggregateCharts(fixedHeightPaper, aggregateData, messages) {
  const charts = configureChartData(aggregateData);

  return (
    <>
      {/* APPLICATIONS: [Submitted, Pending Review, Tuition Required, Approved] */}
      <Grid item xs={12} sm={12} md={6} lg={6}>
          <Paper className={fixedHeightPaper}>
            {charts[1] ? <ChartTemplate chart='bar' data={charts[1]}/> : LoadingFallbackComponent}
          </Paper> 
      </Grid>

      {/* SCHOOLS: Total number of applications per school */}
      <Grid item xs={12} sm={12} md={6} lg={6}>
          <Paper className={fixedHeightPaper}>
            {charts[2] ? <ChartTemplate chart='pie' data={charts[2]}/> : LoadingFallbackComponent}
          </Paper>
      </Grid>


      {/* AIRPORT & HOMESTAY APPLICATIONS: Totals For Each */}
      <Grid item xs={12} sm={12} md={6} lg={6}>
          <Paper className={fixedHeightPaper}>
            {charts[0] ? <ChartTemplate chart='bar' data={charts[0]}/> : LoadingFallbackComponent}
          </Paper>
      </Grid>


      {/* MESSAGES: Display as preview with username and some content */}
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <PreviewTemplate title="recent messages" data={messages}/>
        </Paper>
      </Grid>
    </>
  )
}

function configureChartData(data) {
  const dataTemplate = Object.keys(data).map(type => {
    const { id, ...displayData } = data[type];
    switch (type) {
      case 'schoolApplications': {
        const { total, ...statusData } = displayData;
        return {
          name: convertToSentenceCase(type),
          xAxisKey: 'Status',
          dataKey: 'Totals',
          plots: Object.keys(statusData).map(status => {
            return {Status: status, Totals: statusData[status]}
          })
        }
      }

    case 'otherApplications': {
      const { total, ...applicationData } = displayData;
        return {
        name: convertToSentenceCase(type),
        xAxisKey: 'Type',
        dataKey: 'Totals',
        plots: Object.keys(applicationData).map(total => {
          return {Type: convertToSentenceCase(total).replace('Total', ''), Totals: applicationData[total]}
        })
      }
    }

    case 'schools': {
      const { total, ...applicationData } = displayData;
        return {
          name: convertToSentenceCase(type),
          xAxisKey: 'Name',
          dataKey: 'Totals',
          plots: Object.keys(applicationData).map(school => {
            return {Name: school, Totals: applicationData[school]}
          })
        }
      }
    }
  }).filter(template => template !== undefined);

  return dataTemplate;
}