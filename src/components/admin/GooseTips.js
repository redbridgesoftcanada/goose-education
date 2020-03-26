import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Add, Delete, Edit, Launch } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function GooseTips(props) {
  const { state, dispatch, gooseTips, firebase, history } = props;

  const [ selectedTip, setSelectedTip ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleComposeDialog = () => dispatch({type: 'TOGGLE_COMPOSE_DIALOG'});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  
  const handleRedirect = id => {
    setSelectedTip(gooseTips.find(tip => tip.id === id));
    const redirectPath = {
      pathname: '/goose', 
      state: {
        title: 'Goose Study Abroad',
        selected: 1,
        // selectedTip: selectedTip
      }
    }
    history.push(redirectPath);
  }

  const setEditTip = id => {
    setSelectedTip(gooseTips.find(school => school.id === id));
    toggleEditDialog();
  }
  
  const setDeleteTip = id => {
    setSelectedTip(gooseTips.find(school => school.id === id));
    toggleDeleteConfirm();
  }

  const deleteSchool = () => {
    firebase.deleteSchool(selectedTip.id).then(function() {
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
      <AdminComposeDialog formType="tip" isEdit={false} open={state.composeDialogOpen} onClose={toggleComposeDialog} setSnackbarMessage={setSnackbarMessage}/>

      {/* E D I T */}
      <AdminComposeDialog formType="tip" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage} prevContent={selectedTip}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='admin_school' open={state.deleteConfirmOpen} 
      handleDelete={deleteSchool} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Featured</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gooseTips.map((tip, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{tip.title}</TableCell>
              <TableCell>{tip.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>{format(tip.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <Button size="small" variant="contained" color="secondary" startIcon={<Launch/>} onClick={() => handleRedirect(tip.id)}>View</Button>
                <Button size="small" variant="contained" color="secondary" startIcon={<Edit/>} onClick={() => setEditTip(tip.id)}>Edit</Button>
                <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={() => setDeleteTip(tip.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(GooseTips);