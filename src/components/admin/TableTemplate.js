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

  const [ state, dispatch ] = useReducer(toggleReducer, {
    composeDialogOpen: false,
    editDialogOpen: false,
    deleteConfirmOpen: false,
  });

  return (
    <Suspense fallback={FallbackElement}>
      <Title>{props.type}</Title>
      <DatabaseContext.Consumer>
        {context => 
          <>
            {generateContentTable(state, dispatch, props, context)}
            {props.type !== "Settings" && generatePagination(classes, props.type, context)}
          </>
        }
      </DatabaseContext.Consumer>
    </Suspense>
  );
}

function generateContentTable(state, dispatch, props, context) {
  const { type, snackbarMessage } = props;
  const deleteConfirmToggle = () => dispatch({type: 'DELETE_CONFIRM'});
  const deleteConfirmOpen = state.deleteConfirmOpen;
  const customProps = { state, dispatch, snackbarMessage, deleteConfirmToggle, deleteConfirmOpen };

  switch(type) {
    case "Users":
      customProps.deleteConfirmOpen = state.deleteConfirmOpen;
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

function generatePagination(classes, type, context) {
  return (
    <div className={classes.seeMore}>
      {context.state.isQueryEmpty[type] ? 
      <Typography>All {type} Data Loaded.</Typography>
      :
      <Link color="secondary" href="#" onClick={() => context.paginatedQuery(type)}>
        Load More
      </Link>
      }
    </div>
  )
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {    
    case 'TOGGLE_EDIT_DIALOG':
      return {...state, editDialogOpen: !state.editDialogOpen}
    
    case 'DELETE_CONFIRM':
      return {...state, deleteConfirmOpen: !state.deleteConfirmOpen}
    
  }
}