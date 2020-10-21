import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload, Edit } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function Messages(props) {
  const { firebase, listOfMessages, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle, editOpen, editToggle } = props;

  const [ selectedMessage, setSelectedMessage ] = useState(null);

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const messageData = listOfMessages.find(message => message.id === event.currentTarget.id);
    setSelectedMessage(messageData);
    (actionType === 'edit') ? editToggle() : deleteConfirmToggle();
  }

  const handleDelete = () => {
    const deleteDoc = firebase.deleteMessage(selectedMessage.id);
    console.log(selectedMessage.attachments)
    onDelete(selectedMessage.attachments, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
  }

  return (
    <>
      <AdminComposeDialog 
        isEdit={true} 
        formType="message" 
        open={editOpen} 
        onClose={editToggle} 
        setSnackbarMessage={snackbarMessage} 
        prevContent={selectedMessage}/>

      <DeleteConfirmation 
        deleteType='message' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

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
          {listOfMessages.map((message, i) => {
            const canEdit = message.authorID === firebase.getCurrentUser().uid;
            return (
              <TableRow key={i} hover>
                <TableCell>{message.authorDisplayName}</TableCell>
                <TableCell>{message.title}</TableCell>
                <TableCell>{format(message.updatedAt, "Pp")}</TableCell>
                <TableCell>
                  <IconButton name='edit' id={message.id} color="secondary" onClick={toggleClickAction} disabled={!canEdit}>
                    <Edit fontSize="small"/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton name='delete' id={message.id} color="secondary" onClick={toggleClickAction}>
                    <Clear fontSize="small"/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={()=>window.open(message.attachments, "_blank")} disabled={!message.attachments.length}>
                    <CloudDownload fontSize="small"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Messages);