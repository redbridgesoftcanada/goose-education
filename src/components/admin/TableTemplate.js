import React, { Suspense, lazy, useState } from "react";
import { Backdrop, CircularProgress, Link, Typography } from "@material-ui/core";
import Title from "./Title";
import { DatabaseContext } from '../../components/database';
import { useStyles } from '../../styles/adminDashboard';

const Accounts = lazy(() => import('../admin/Accounts'));
const Schools = lazy(() => import('../admin/Schools'));
const Applications = lazy(() => import('../admin/Applications'));
const Homestays = lazy(() => import('../admin/Homestays'));
const AirportRides = lazy(() => import('../admin/AirportRides'));
const GooseTips = lazy(() => import('../admin/GooseTips'));
const Articles = lazy(() => import('../admin/Articles'));
const Announcements = lazy(() => import('../admin/Announcements'));
const Messages = lazy(() => import('../admin/Messages'));
const Settings = lazy(() => import('../admin/Settings'));

const FallbackElement = <Backdrop open={true}><CircularProgress color="primary"/></Backdrop>;

export default function TableTemplate(props) {
  const classes = useStyles();

  const [ composeOpen, setCompose ] = useState(false);
  const [ editOpen, setEdit ] = useState(false);
  const [ deleteConfirmOpen, setDelete ] = useState(false);

  const stateVars = {composeOpen, editOpen, deleteConfirmOpen }
  const setStates = { setCompose, setEdit, setDelete }

  return (
    <Suspense fallback={FallbackElement}>
      <Title>{props.type}</Title>
      <DatabaseContext.Consumer>
        {context => 
          <>
            {generateContentTable(stateVars, setStates, props, context)}
            {props.type !== "Settings" && generatePagination(classes, props.type, context)}
          </>
        }
      </DatabaseContext.Consumer>
    </Suspense>
  );
}

function generateContentTable(stateVars, setStates, props, context) {
  const { type, snackbarMessage } = props;
  const { composeOpen, editOpen, deleteConfirmOpen } = stateVars;
  const { setCompose, setEdit, setDelete } = setStates;

  const editConfirmToggle = () => setEdit(!editOpen);  
  const deleteConfirmToggle = () => setDelete(!deleteConfirmOpen);
  const customProps = { snackbarMessage, deleteConfirmOpen, deleteConfirmToggle };

  switch(type) {
    case "Users":
      customProps.listOfUsers = context.state.listOfUsers;
      return <Accounts {...customProps}/>
    
    case "Schools":
      customProps.listOfSchools = context.state.listOfSchools;
      customProps.editOpen = editOpen;
      customProps.editToggle = editConfirmToggle;
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
      customProps.editOpen = editOpen;
      customProps.editToggle = editConfirmToggle;
      return <GooseTips {...customProps}/>

    case "Articles":
      customProps.listOfArticles = context.state.listOfArticles;
      customProps.editOpen = editOpen;
      customProps.editToggle = editConfirmToggle;
      return <Articles {...customProps}/>
    
    case "Announcements":
      customProps.listOfAnnouncements = context.state.listOfAnnouncements;
      customProps.editOpen = editOpen;
      customProps.editToggle = editConfirmToggle;
      return <Announcements {...customProps}/>

    case "Messages":
      customProps.listOfMessages = context.state.listOfMessages;
      customProps.editOpen = editOpen;
      customProps.editToggle = editConfirmToggle;
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