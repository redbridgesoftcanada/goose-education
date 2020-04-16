import React, { useReducer, Fragment } from "react";
import { Link, Typography, makeStyles } from "@material-ui/core";
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

function preventDefault(event) {
  event.preventDefault();
}

function toggleReducer(state, action) {
  const { type, payload } = action;

  switch(type) {
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

function createContentTable(state, dispatch, type, context) {
  const props = { state, dispatch };

  switch(type) {
    case "Users":
      props.listOfUsers = context.listOfUsers;
      return <Accounts {...props}/>
    
    case "Schools":
      props.listOfSchools = context.listOfSchools;
    return <Schools {...props}/>

    case "Applications":
      props.listOfApplications = context.listOfApplications;
      return <Applications {...props}/>
    
    case "Homestay":
      props.listOfHomestays = context.listOfHomestays;
      return <Homestays {...props}/>

    case "Airport Rides":
      props.listOfAirportRides = context.listOfAirportRides;
      return <AirportRides {...props}/>

    case "Goose Tips":
      props.listOfTips = context.gooseTips;
      return <GooseTips {...props}/>

    case "Articles":
      props.listOfArticles = context.taggedArticles;
      return <Articles {...props}/>
    
    case "Announcements":
      props.listOfAnnouncements = context.listOfAnnouncements;
      return <Announcements {...props}/>

    case "Messages":
      props.listOfMessages = context.listOfMessages;
      return <Messages {...props}/>

    default:
      return <Typography>Sorry! No corresponding content to display.</Typography>
  }
}

function TableTemplate(props) {
  const { type } = props;

  // S T A T E
  const INITIAL_STATE = {
    anchorUserRole: null,
    anchorApplicationStatus: null,
    deleteConfirmOpen: false,
    snackbarOpen: false,
    snackbarMessage: null,
    composeDialogOpen: false,
    editDialogOpen: false,
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  // S T Y L I N G 
  const classes = useStyles();

  return (
    <Fragment>
      <Title>{type}</Title>
      <DatabaseContext.Consumer>
        {context => createContentTable(state, dispatch, type, context)}
      </DatabaseContext.Consumer>

      <div className={classes.seeMore}>
        {/* create "load more" feature */}
        <Link color="secondary" href="#" onClick={preventDefault}>
          See more {type}
        </Link>
      </div>
    </Fragment>
  );
}

export default TableTemplate;