import React, { useReducer, Fragment } from "react";
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

function generateContentTable(state, dispatch, type, context) {
  const props = { state, dispatch };

  switch(type) {
    case "Users":
      props.listOfUsers = context.state.listOfUsers;
      return <Accounts {...props}/>
    
    case "Schools":
      props.listOfSchools = context.state.listOfSchools;
    return <Schools {...props}/>

    case "Applications":
      props.listOfApplications = context.state.listOfApplications;
      return <Applications {...props}/>
    
    case "Homestays":
      props.listOfHomestays = context.state.listOfHomestays;
      return <Homestays {...props}/>

    case "Airport Rides":
      props.listOfAirportRides = context.state.listOfAirportRides;
      return <AirportRides {...props}/>

    case "Goose Tips":
      props.listOfTips = context.state.gooseTips;
      return <GooseTips {...props}/>

    case "Articles":
      props.listOfArticles = context.state.listOfArticles;
      return <Articles {...props}/>
    
    case "Announcements":
      props.listOfAnnouncements = context.state.listOfAnnouncements;
      return <Announcements {...props}/>

    case "Messages":
      props.listOfMessages = context.state.listOfMessages;
      return <Messages {...props}/>

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
      context.state.isLastDoc[type] ? 
      <Typography>End</Typography>
      :
      <Link color="secondary" href="#" onClick={() => loadMoreHandler(type)}>
        See more {type}
      </Link>
      }
    </div>
  )
}

function TableTemplate(props) {
  const classes = useStyles();
  const { type } = props;

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
    <Fragment>
      <Title>{type}</Title>
      <DatabaseContext.Consumer>
        {context => 
          <>
            {generateContentTable(state, dispatch, type, context)}
            {generatePagination(classes, state, dispatch, type, context)}
          </>
        }
      </DatabaseContext.Consumer>
    </Fragment>
  );
}

export default TableTemplate;