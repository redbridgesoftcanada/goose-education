import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { format } from "date-fns";
// import DeleteConfirmation from '../DeleteConfirmation';

export default function Applications(props) {
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
      </Table>
    </>
  )
}