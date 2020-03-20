import React from "react";
import { Button, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import { STATUSES } from "../../constants/constants";
// import DeleteConfirmation from '../DeleteConfirmation';

function Applications(props) {
  const { state, dispatch, listOfApplications, firebase } = props;

  const setMenuOpen = event => dispatch({type: 'MENU_OPEN', payload: {
    key: 'anchorApplicationStatus', 
    selected: event.currentTarget }
  });
  
  const setMenuClose = (event, authorId) => {
    if (authorId) {
      dispatch({type: 'MENU_SELECTED', payload: {
        key: 'anchorApplicationStatus', 
        selectedStatus: event.currentTarget.id,
        authorId, 
        firebase }
      });
    } else {
      dispatch({type: 'MENU_CLOSE', payload: 'anchorApplicationStatus'});
    }
  }

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
      <Table size="small">
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
        {listOfApplications.map((application, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{application.firstName} {application.lastName}</TableCell>
            <TableCell>{format(application.createdAt, "Pp")}</TableCell>
            <TableCell>
              <Button onClick={setMenuOpen}>{application.status}</Button>
              <Menu
                keepMounted
                anchorEl={state.anchorApplicationStatus}
                open={Boolean(state.anchorApplicationStatus)}
                onClose={event => setMenuClose(event, null)}
              >
                {STATUSES.map((status, i) => {
                  return (
                    <MenuItem key={i} id={status} onClick={event => setMenuClose(event, application.authorID)}>{status}</MenuItem>
                  )
                })}
              </Menu>
            </TableCell>
            <TableCell>Download, Delete</TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Applications);