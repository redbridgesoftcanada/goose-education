import React from "react";
import { Button, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Add, Delete, Edit } from "@material-ui/icons";
import DeleteConfirmation from '../DeleteConfirmation';

export default function Schools(props) {
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
          <TableCell>
            <Button size="small" variant="contained" color="secondary" startIcon={<Add/>}>Create</Button>
          </TableCell>
        </TableRow>
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
            <TableCell>
              <Button size="small" variant="contained" color="secondary" startIcon={<Edit/>}>Edit</Button>
              <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={toggleDeleteConfirm}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}