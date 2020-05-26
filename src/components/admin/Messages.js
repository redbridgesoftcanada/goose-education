import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Messages(props) {
  const { state, dispatch, listOfMessages, firebase } = props;

  const [ selectedMessage, setSelectedMessage ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setEditMessage = id => {
    setSelectedMessage(listOfMessages.find(message => message.id === id));
    toggleEditDialog();
  }
  
  const setDeleteMessage = id => {
    setSelectedMessage(listOfMessages.find(message => message.id === id));
    toggleDeleteConfirm();
  }

  const deleteMessage = () => {
    firebase.deleteMessage(selectedMessage.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Message deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* E D I T */}
      <AdminComposeDialog formType="message" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage} prevContent={selectedMessage}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='message' open={state.deleteConfirmOpen} 
      handleDelete={deleteMessage} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfMessages.map((message, i) => (
            <TableRow key={i} hover>
              <TableCell>{message.authorDisplayName}</TableCell>
              <TableCell>{message.title}</TableCell>
              <TableCell>{format(message.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setEditMessage(message.id)}>
                  {message.authorDisplayName === "슈퍼관리자" && <EditOutlined fontSize="small"/>}
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setDeleteMessage(message.id)}>
                  <Clear fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell>
                {message.attachment ?
                  <IconButton color="secondary" onClick={()=>console.log('Clicked')}>
                    <CloudDownload fontSize="small"/>
                  </IconButton>
                  :
                  "No attachment submitted."
                }
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Messages);