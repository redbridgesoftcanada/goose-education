import React, { useReducer, Fragment } from "react";
import { Button, Link, Menu, MenuItem, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Typography, makeStyles } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Delete } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from '../../components/firebase';
import Title from "./Title";
import DeleteConfirmation from '../DeleteConfirmation';

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
    case 'MENU_OPEN':
      return {...state, anchorEl: payload}
    
    case 'MENU_CLOSE':
      const { firebase, selectedRole, uid } = payload;
      const currentRole = payload.roles[0] ? payload.roles[0] : 'user';

      if (currentRole !== selectedRole && selectedRole !== 'user') {
        const userQuery = firebase.user(uid).update({
          roles: {
            [selectedRole]: true
          }
        });
        
        userQuery.then(() => {
          return {...state, anchorEl: null}
        }).catch(error => console.log(error))

      } else if (currentRole !== selectedRole && selectedRole === 'user') {
        const userQuery = firebase.user(uid).update({
          roles: {}
        });
        
        userQuery.then(() => {
          return {...state, anchorEl: null}
        }).catch(error => console.log(error))
      }
      break;
    
    case 'DELETE_CONFIRM':
      return {...state, deleteConfirmOpen: !state.deleteConfirmOpen}
    
    case 'SNACKBAR_OPEN':
      return {...state, snackbarOpen: !state.snackbarOpen, snackbarMessage: payload}
  }
}

function createTableContent(state, dispatch, type, content, firebase) {
  // const { anchorEl } = state;

  const setMenuOpen = event => dispatch({type: 'MENU_OPEN', payload: event.currentTarget});
  const setMenuClose = (event, roles, uid) => dispatch({type: 'MENU_CLOSE', payload: {uid, roles, firebase, selectedRole: event.currentTarget.id}});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});


  switch(type) {
    case "accounts": 
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((user, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button disabled={user.roles['admin']} onClick={setMenuOpen}>
                    {user.roles["admin"] ? "Admin" : user.roles["supervisor"] ? "Supervisor" : "User"}
                  </Button>
                  <Menu
                    anchorEl={state.anchorEl}
                    keepMounted
                    open={Boolean(state.anchorEl)}
                    onClose={setMenuClose}
                  >
                    <MenuItem id="supervisor" onClick={event => setMenuClose(event, user.roles, user.id)}>Supervisor</MenuItem>
                    <MenuItem id="user" onClick={event => setMenuClose(event, user.roles, user.id)}>User</MenuItem>
                  </Menu>

                </TableCell>
                <TableCell>
                  {!user.roles["admin"] ? 
                    <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={toggleDeleteConfirm}>Delete</Button>
                    // <IconButton size="small" variant="contained" color="secondary"><Delete/></IconButton>
                  : 
                  "Please contact management about any changes to the admin user."}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )
    
    case "applications":
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((resource, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{resource.firstName} {resource.lastName}</TableCell>
                <TableCell>{format(resource.createdAt, "Pp")}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>Download, Change Status, Delete</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )
    
    case "schools":
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((resource, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{resource.title}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell>{resource.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
                <TableCell>Create, Edit, Delete, Change Featured</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )

      default:
        return <Typography>(⁄ ⁄•⁄ω⁄•⁄ ⁄)</Typography>
  }
}

function TableTemplate(props) {
  const { type, listOfResources, firebase } = props;
  const classes = useStyles();

  const INITIAL_STATE = {
    anchorEl: null,
    deleteConfirmOpen: false,
    snackbarOpen: false,
    snackbarMessage: null,
  }

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  const deleteUser = () => {

    // >> delete user in Firestore <<

    // firebase.deleteUser(uid).then(function() {
    //   // User deleted
    //  dispatch({type: 'DELETE_CONFIRM'})
    // }).catch(function(error) {
    //   // An error happened.
    // });
    
    setSnackbarMessage('User successfully deleted!')
  }

  return (
    <Fragment>
      <Title>{type}</Title>
      <Table size="small">
        {createTableContent(state, dispatch, type, listOfResources, firebase)}
      </Table>

      <DeleteConfirmation deleteType='admin_user' open={state.deleteConfirmOpen} 
      handleDelete={() => deleteUser()} 
      onClose={toggleDeleteConfirm}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={state.snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarMessage(null)}
        message={state.snackbarMessage}
      />

      <div className={classes.seeMore}>
        {/* create "load more" feature */}
        <Link color="secondary" href="#" onClick={preventDefault}>
          See more {type}
        </Link>
      </div>
    </Fragment>
  );
}

export default withFirebase(TableTemplate);