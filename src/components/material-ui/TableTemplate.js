import React, { useReducer } from "react";
import { CircularProgress, Link, Typography, makeStyles } from "@material-ui/core";
import Title from "./Title";
import { DatabaseContext } from '../../components/database';
import Accounts from '../admin/Accounts';
import Schools from '../admin/Schools';
import Applications from '../admin/Applications';
import Homestays from '../admin/Homestays';
import AirportRides from '../admin/AirportRides';
import GooseTips from '../admin/GooseTips';
import Articles from '../admin/Articles';
import Announcements from '../admin/Announcements';
import Messages from '../admin/Messages';
import Settings from '../admin/Settings';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
    case 'TOGGLE_LOADING':
      return {...state, isLoading: !state.isLoading}
    
    case 'MENU_OPEN': {
      const anchorKey = payload.key;
      const selectedMenu = payload.selected;
      return {...state, [anchorKey]: selectedMenu}
    }
    
    case 'MENU_SELECTED': {
      const anchorKey = payload.key;
      switch (anchorKey) {
        case "anchorUserRole": {
          const { firebase, selectedRole, uid } = payload;
          if (selectedRole === 'supervisor') {
            firebase.user(uid).update({
              roles: { [selectedRole]: true }
            });
          } else if (selectedRole === 'user') {
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
      customProps.listOfGraphics = context.state.adminGraphics.sort((a, b) => {
        if (a.location < b.location) return -1;
        if (a.location > b.location) return 1;
        return 0;
      });
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

function TableTemplate(props) {
  const classes = useStyles();

  // S T A T E
  const INITIAL_STATE = {
    isLoading: false,
    anchorUserRole: null,
    anchorApplicationStatus: null,
    deleteConfirmOpen: false,
    snackbarOpen: false,
    snackbarMessage: null,
    composeDialogOpen: false,
    editDialogOpen: false,
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  return (
    <>
      <Title>{props.type}</Title>
      <DatabaseContext.Consumer>
        {context => 
          <>
            {generateContentTable(state, dispatch, props, context)}
            {props.type !== "Settings" && generatePagination(classes, state, dispatch, props.type, context)}
          </>
        }
      </DatabaseContext.Consumer>
    </>
  );
}

export default TableTemplate;