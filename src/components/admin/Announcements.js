import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Announcements(props) {
  const { state, dispatch, listOfAnnouncements, firebase } = props;

  // S T A T E
  const [ selectedAnnounce, setSelectedAnnounce ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setEditAnnounce = id => {
    setSelectedAnnounce(listOfAnnouncements.find(announce => announce.id === id));
    toggleEditDialog();
  }
  
  const setDeleteAnnounce = id => {
    setSelectedAnnounce(listOfAnnouncements.find(announce => announce.id === id));
    toggleDeleteConfirm();
  }

  const deleteAnnounce = () => {
    firebase.deleteAnnouncement(selectedAnnounce.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Announcement deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* E D I T */}
      <AdminComposeDialog formType="announce" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage} prevContent={selectedAnnounce}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='admin_announce' open={state.deleteConfirmOpen} 
      handleDelete={deleteAnnounce} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfAnnouncements.map((announce, i) => (
            <TableRow key={i} hover>
              <TableCell>{announce.title}</TableCell>
              <TableCell>{format(announce.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setEditAnnounce(announce.id)}>
                  <EditOutlined fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setDeleteAnnounce(announce.id)}>
                  <Clear fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Announcements);