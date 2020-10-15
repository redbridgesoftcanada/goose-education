import React, { Fragment, useState, useRef } from "react";
import { Button, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { format } from 'date-fns';
import { onDelete } from '../../constants/helpers/_storage';
import { withFirebase } from "../../components/firebase";
import DeleteConfirmation from '../DeleteConfirmation';

function Accounts(props) {
  const { firebase, listOfUsers, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle } = props;

  const accountRef = useRef(null);
  const [ userAccount, setUserAccount ] = useState(null);

  const setMenuOpen = event => setUserAccount(event.currentTarget);
  
  const setMenuClose = event => {
    accountRef.current = listOfUsers.find(user => user.id === userAccount.id);
    const selectedRole = event.currentTarget.id
    const isDuplicate = selectedRole && accountRef.current.roles[selectedRole] === true;

    const cleanupActions = message => {
      snackbarMessage(message);
      setUserAccount(null);
    }

    if (isDuplicate) {
      cleanupActions('Same account role - no changes have been saved.');
    } else if (!isDuplicate && selectedRole) {
      // a new user role has been selected → save and close menu;      
      switch (selectedRole) {
        case 'admin':
          firebase.user(userAccount.id).update({'roles.admin': true})
          .then(() => cleanupActions('Account role has been updated to admin.'));
          break;

        // case 'supervisor':
        //   firebase.user(userAccount.id).update({'roles.supervisor': true})
        //   .then(() => cleanupActions('Account role has been updated to supervisor.'));
        //   break;
        
        case 'user':
          // overwrites entire map field (roles) w/o dot notation;
          firebase.user(userAccount.id).update({ roles: {} })
          .then(() => cleanupActions('Account role has been updated to user.'));
          break;
      }
    } else {
      setUserAccount(null);
    }
  }
  
  const setDeleteUser = event => {
    accountRef.current = event.currentTarget.id
    deleteConfirmToggle();
  }

  const handleDelete = async () => {
    await firebase.deleteUser(accountRef.current);
    snackbarMessage('Successfully deleted user account!');
    deleteConfirmToggle();
  }

  return (
    <>
      <DeleteConfirmation
        deleteType='admin_user' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>
      
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align='center'>First Name</TableCell>
            <TableCell align='center'>Last Name</TableCell>
            <TableCell align='center'>Username</TableCell>
            <TableCell align='center'>Email</TableCell>
            <TableCell align='center'>Phone</TableCell>
            <TableCell align='center'>Mobile</TableCell>
            <TableCell align='center'>Roles</TableCell>
            <TableCell align='center'>Latest Activity</TableCell>
            <TableCell align='center'>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfUsers.map((user, i) => {
            const userRole = Object.keys(user.roles).length ? Object.keys(user.roles).filter(role => user.roles[role] === true)[0] : "User";
            return (
              <Fragment key={i}>
                <TableRow hover>
                  <TableCell align='center'>{user.firstName}</TableCell>
                  <TableCell align='center'>{user.lastName}</TableCell>
                  <TableCell align='center'>{user.username}</TableCell>
                  <TableCell align='center'>{user.email}</TableCell>
                  <TableCell align='center'>{user.phoneNumber}</TableCell>
                  <TableCell align='center'>{user.mobileNumber}</TableCell>
                  <TableCell align='center'>
                    <Button id={user.id} disabled={user.roles['admin']} onClick={setMenuOpen}>{userRole}</Button>
                    <Menu
                      anchorEl={userAccount}
                      keepMounted
                      open={Boolean(userAccount)}
                      onClose={setMenuClose}
                    >
                      <MenuItem id="admin" onClick={setMenuClose}>Administrator</MenuItem>
                      {/* <MenuItem id="supervisor" onClick={setMenuClose}>Supervisor</MenuItem> */}
                      <MenuItem id="user" onClick={setMenuClose}>User</MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell align='center'>{user.lastSignInTime ? format(user.lastSignInTime, 'Pp') : null}</TableCell>
                  <TableCell align='center'>
                    {!user.roles["admin"] ? 
                      <IconButton id={user.id} color="secondary" onClick={setDeleteUser}>
                        <Clear fontSize='small'/>
                      </IconButton>
                    : 
                    "Please contact management about any changes to the admin user."}
                  </TableCell>
                </TableRow>
              </Fragment>
            )}
          )}
        </TableBody>
      </Table>
  </>
  )
}

export default withFirebase(Accounts);