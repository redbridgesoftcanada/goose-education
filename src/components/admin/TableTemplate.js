import React, { Suspense, useReducer } from "react";
import { Backdrop, CircularProgress, Link, Typography } from "@material-ui/core";
import Title from "./Title";
import { DatabaseContext } from '../../components/database';
import { useStyles } from '../../styles/adminDashboard';

const Accounts = React.lazy(() => import('../admin/Accounts'));
const Schools = React.lazy(() => import('../admin/Schools'));
const Applications = React.lazy(() => import('../admin/Applications'));
const Homestays = React.lazy(() => import('../admin/Homestays'));
const AirportRides = React.lazy(() => import('../admin/AirportRides'));
const GooseTips = React.lazy(() => import('../admin/GooseTips'));
const Articles = React.lazy(() => import('../admin/Articles'));
const Announcements = React.lazy(() => import('../admin/Announcements'));
const Messages = React.lazy(() => import('../admin/Messages'));
const Settings = React.lazy(() => import('../admin/Settings'));

const FallbackElement = <Backdrop open={true}><CircularProgress color="primary"/></Backdrop>;

export default function TableTemplate(props) {
  const classes = useStyles();

  const INITIAL_STATE = {
    isLoading: false,
    anchorUserRole: null,
    anchorApplicationStatus: null,
    composeDialogOpen: false,
    editDialogOpen: false,
    deleteConfirmOpen: false,
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  return (
    <Suspense fallback={FallbackElement}>
      <Title>{props.type}</Title>
      <DatabaseContext.Consumer>
        {context => 
          <>
            {generateContentTable(state, dispatch, props, context)}
            {props.type !== "Settings" && generatePagination(classes, state, dispatch, props.type, context)}
          </>
        }
      </DatabaseContext.Consumer>
    </Suspense>
  );
}

function generateContentTable(state, dispatch, props, context) {
  const { type, snackbarMessage } = props;
  const customProps = { state, dispatch };

  switch(type) {
    case "Users":
      customProps.listOfUsers = context.state.listOfUsers;
      return <Accounts {...customProps}/>
    
    case "Schools":
      customProps.listOfSchools = context.state.listOfSchools;
    return <Schools {...customProps}/>

    case "Applications":
      customProps.listOfApplications = context.state.listOfApplications;
      return <Applications {...customProps}/>
    
    case "Homestays":
      customProps.listOfHomestays = context.state.listOfHomestays;
      return <Homestays {...customProps}/>

    case "Airport Rides":
      customProps.listOfAirportRides = context.state.listOfAirportRides;
      return <AirportRides {...customProps}/>

    case "Goose Tips":
      customProps.listOfTips = context.state.gooseTips;
      return <GooseTips {...customProps}/>

    case "Articles":
      customProps.listOfArticles = context.state.listOfArticles;
      return <Articles {...customProps}/>
    
    case "Announcements":
      customProps.listOfAnnouncements = context.state.listOfAnnouncements;
      return <Announcements {...customProps}/>

    case "Messages":
      customProps.listOfMessages = context.state.listOfMessages;
      return <Messages {...customProps}/>

    case "Settings":
      customProps.snackbarMessage = snackbarMessage;
      customProps.listOfGraphics = Object.values(context.state.adminGraphics).sort((a, b) => {
        if (a.location < b.location) return -1;
        if (a.location > b.location) return 1;
        return 0;
      });
      customProps.listOfImages = Object.values(context.state.adminGraphics).flatMap(graphic => graphic.image ? [{id: graphic.id, url: graphic.image}] : []);
      return <Settings {...customProps}/>

    default:
      return <Typography>Sorry! No corresponding content to display.</Typography>
  }
}

function generatePagination(classes, state, dispatch, type, context) {
  const loadMoreHandler = type => {
    dispatch({type:"TOGGLE_LOADING"});
    context.paginatedQuery(type);
    dispatch({type:"TOGGLE_LOADING"});
  }

  return (
    <div className={classes.seeMore}>
      {state.isLoading ? 
      <CircularProgress color="secondary"/>
      :
      context.state.isQueryEmpty[type] ? 
      <Typography>All {type} Data Loaded.</Typography>
      :
      <Link color="secondary" href="#" onClick={() => loadMoreHandler(type)}>
        Load More
      </Link>
      }
    </div>
  )
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case 'TOGGLE_LOADING':
      return {...state, isLoading: !state.isLoading}
    
    case 'MENU_OPEN': {
      const anchorKey = payload.key;
      const anchorEl = payload.selected;
      return {...state, [anchorKey]: anchorEl}
    }
    
    case 'MENU_SELECTED': {
      const anchorKey = payload.key;
      switch (anchorKey) {
        case "anchorUserRole": {
          const uid = state[anchorKey].id;
          const { firebase, userRole } = payload;
          if (userRole === 'supervisor') {
            firebase.user(uid).update({
              roles: { [userRole]: true }
            });
          } else if (userRole === 'user') {
            firebase.user(uid).update({
              roles: {}
            });
          }
          return {...state, anchorUserRole: null}
        }
        
        case "anchorApplicationStatus": {
          const { firebase, selectedStatus, authorId } = payload;
          firebase.schoolApplication(authorId).update({status: selectedStatus});
          return {...state, anchorApplicationStatus: null}
        }
      }
    }

    case 'MENU_CLOSE': {
      const anchorKey = payload;
      return {...state, [anchorKey]: null}
    }

    case 'TOGGLE_EDIT_DIALOG':
      return {...state, editDialogOpen: !state.editDialogOpen}
    
    case 'DELETE_CONFIRM':
      return {...state, deleteConfirmOpen: !state.deleteConfirmOpen}
    
  }
}