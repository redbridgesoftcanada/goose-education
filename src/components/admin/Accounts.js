import React, { Fragment } from "react";
import { Button, Menu, MenuItem, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import DeleteConfirmation from '../DeleteConfirmation';

export default function Accounts(props) {
  const { state, dispatch, content, firebase } = props;

  const setMenuOpen = event => dispatch({type: 'MENU_OPEN', payload: event.currentTarget});
  const setMenuClose = (event, uid) => dispatch({type: 'MENU_CLOSE', payload: {uid, firebase, selectedRole: event.currentTarget.id}});
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  const deleteUser = uid => {
    firebase.deleteUser(uid).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('User successfully deleted!');
    }).catch(function(error) {
      console.log(error)
    });
  }

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
          <Fragment key={i}>
            <TableRow>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button disabled={user.roles['admin']} onClick={setMenuOpen}>
                  {user.roles["admin"] ? "Admin" : user.roles["supervisor"] ? "Supervisor" : "User"}
                </Button>
                <Menu
                  id="menu"
                  anchorEl={state.anchorEl}
                  keepMounted
                  open={Boolean(state.anchorEl)}
                  onClose={event => setMenuClose(event, null)}
                >
                  <MenuItem id="supervisor" onClick={event => setMenuClose(event, user.id)}>Supervisor</MenuItem>
                  <MenuItem id="user" onClick={event => setMenuClose(event, user.id)}>User</MenuItem>
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

            <DeleteConfirmation deleteType='admin_user' open={state.deleteConfirmOpen} 
            handleDelete={() => deleteUser(user.id)} 
            onClose={toggleDeleteConfirm}/>
          </Fragment>
        ))}
      </TableBody>
  </>
  )
}