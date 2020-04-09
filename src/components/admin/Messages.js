import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Add, Delete, Edit, Launch } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Messages(props) {
  const { state, dispatch, listOfMessages, firebase, history } = props;

  const [ selectedAnnounce, setSelectedAnnounce ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleComposeDialog = () => dispatch({type: 'TOGGLE_COMPOSE_DIALOG'});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  
  const handleRedirect = id => {
    setSelectedAnnounce(listOfMessages.find(tip => tip.id === id));
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

  const setEditMessage = id => {
    setSelectedAnnounce(listOfMessages.find(announce => announce.id === id));
    toggleEditDialog();
  }
  
  const setDeleteMessage = id => {
    setSelectedAnnounce(listOfMessages.find(announce => announce.id === id));
    toggleDeleteConfirm();
  }

  const deleteMessage = () => {
    firebase.deleteMessage(selectedAnnounce.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Message deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* C R E A T E */}
      <Button size="small" variant="contained" color="secondary" startIcon={<Add/>} onClick={toggleComposeDialog}>Create</Button>
      <AdminComposeDialog formType="message" isEdit={false} open={state.composeDialogOpen} onClose={toggleComposeDialog} setSnackbarMessage={setSnackbarMessage}/>

      {/* E D I T */}
      <AdminComposeDialog formType="message" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage} prevContent={selectedAnnounce}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='message' open={state.deleteConfirmOpen} 
      handleDelete={deleteMessage} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfMessages.map((announce, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{announce.title}</TableCell>
              <TableCell>{format(announce.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <Button size="small" variant="contained" color="secondary" startIcon={<Launch/>} onClick={() => handleRedirect(announce.id)}>View</Button>
                {announce.authorDisplayName === "슈퍼관리자" && <Button size="small" variant="contained" color="secondary" startIcon={<Edit/>} onClick={() => setEditMessage(announce.id)}>Edit</Button>}
                <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={() => setDeleteMessage(announce.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Messages);