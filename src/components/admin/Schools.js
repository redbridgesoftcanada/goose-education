import React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Add, Delete, Edit } from "@material-ui/icons";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Schools(props) {
  const { state, dispatch, listOfSchools, firebase } = props;

  const toggleComposeDialog = () => dispatch({type:'TOGGLE_DIALOG'});
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
      <Button size="small" variant="contained" color="secondary" startIcon={<Add/>} id="create" onClick={toggleComposeDialog}>Create</Button>
      <AdminComposeDialog open={state.composeDialogOpen} onClose={toggleComposeDialog} setSnackbarMessage={setSnackbarMessage}/>

      <Table size="small">
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
          {listOfSchools.map((school, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{school.title}</TableCell>
              <TableCell>{school.type}</TableCell>
              <TableCell>{school.location}</TableCell>
              <TableCell>{school.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>
                <Button size="small" variant="contained" color="secondary" startIcon={<Edit/>}onClick={toggleComposeDialog}>Edit</Button>
                <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={toggleDeleteConfirm}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Schools);