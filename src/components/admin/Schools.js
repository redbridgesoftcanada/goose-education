import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Add, Delete, Edit } from "@material-ui/icons";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Schools(props) {
  const { state, dispatch, listOfSchools, firebase } = props;

  const [ selectedSchool, setSelectedSchool ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleComposeDialog = () => dispatch({type: 'TOGGLE_COMPOSE_DIALOG'});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  
  const setEditSchool = id => {
    setSelectedSchool(listOfSchools.find(school => school.id === id));
    toggleEditDialog();
  }
  
  const setDeleteSchool = id => {
    setSelectedSchool(listOfSchools.find(school => school.id === id));
    toggleDeleteConfirm();
  }

  const deleteSchool = () => {
    firebase.deleteSchool(selectedSchool.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('School deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* C R E A T E */}
      <Button size="small" variant="contained" color="secondary" startIcon={<Add/>} onClick={toggleComposeDialog}>Create</Button>
      <AdminComposeDialog formType="school" isEdit={false} open={state.composeDialogOpen} onClose={toggleComposeDialog} setSnackbarMessage={setSnackbarMessage}/>

      {/* E D I T */}
      <AdminComposeDialog prevContent={selectedSchool} formType="school" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='admin_school' open={state.deleteConfirmOpen} 
      handleDelete={deleteSchool} 
      onClose={toggleDeleteConfirm}/>

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
                <Button size="small" variant="contained" color="secondary" startIcon={<Edit/>} onClick={() => setEditSchool(school.id)}>Edit</Button>
                <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={() => setDeleteSchool(school.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Schools);