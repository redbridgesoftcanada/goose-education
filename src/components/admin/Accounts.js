import React, { Fragment, useState } from "react";
import { Button, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { format } from 'date-fns';
import { withFirebase } from "../../components/firebase";
import DeleteConfirmation from '../DeleteConfirmation';

function Accounts(props) {
  const { state, dispatch, listOfUsers, firebase } = props;

  const [ selectedUser, setSelectedUser ] = useState(null);

  const setMenuOpen = event => dispatch({type: 'MENU_OPEN', payload: {
    key: 'anchorUserRole', 
    selected: event.currentTarget }
  });

  const setMenuClose = event => {
    const userRole = event.currentTarget.id
    if (event.currentTarget.id) {
      dispatch({type: 'MENU_SELECTED', payload: {
        key: 'anchorUserRole', 
        userRole,
        firebase }
      });
    } else {
      dispatch({type:'MENU_CLOSE', payload: "anchorUserRole"});
    }
  }
  
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  
  const setDeleteUser = uid => {
    setSelectedUser(listOfUsers.find(user => user.id === uid));
    toggleDeleteConfirm();
  }
  
  const deleteUser = () => {
    firebase.deleteUser(selectedUser.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('User successfully deleted!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* D E L E T E */}
      <DeleteConfirmation deleteType='admin_user' open={state.deleteConfirmOpen} 
      handleDelete={deleteUser} 
      onClose={toggleDeleteConfirm}/>
      
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Latest Activity</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfUsers.map((user, i) => (
            <Fragment key={i}>
              <TableRow hover>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>
                  <Button id={user.id} disabled={user.roles['admin']} onClick={setMenuOpen}>
                    {user.roles["admin"] ? "Admin" : user.roles["supervisor"] ? "Supervisor" : "User"}
                  </Button>
                  <Menu
                    anchorEl={state.anchorUserRole}
                    keepMounted
                    open={Boolean(state.anchorUserRole)}
                    onClose={setMenuClose}
                  >
                    <MenuItem id="admin" onClick={setMenuClose}>Administrator</MenuItem>
                    <MenuItem id="supervisor" onClick={setMenuClose}>Supervisor</MenuItem>
                    <MenuItem id="user" onClick={setMenuClose}>User</MenuItem>
                  </Menu>
                </TableCell>
                <TableCell>{user.lastSignInTime ? format(user.lastSignInTime, 'Pp') : ""}</TableCell>
                <TableCell>
                  {!user.roles["admin"] ? 
                    <IconButton color="secondary" onClick={() => setDeleteUser(user.id)}>
                      <Clear/>
                    </IconButton>
                  : 
                  "Please contact management about any changes to the admin user."}
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
  </>
  )
}

export default withFirebase(Accounts);