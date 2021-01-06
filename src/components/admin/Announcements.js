import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, Edit } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function Announcements(props) {
  const { firebase, listOfAnnouncements, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle, editOpen, editToggle } = props;

  const [ selectedAnnounce, setSelectedAnnounce ] = useState(null);

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const announceData = listOfAnnouncements.find(announce => announce.id === event.currentTarget.id);
    setSelectedAnnounce(announceData);
    (actionType === 'edit') ? editToggle() : deleteConfirmToggle();
  }

  const handleDelete = () => {
    const selected = { id: selectedAnnounce.id, upload: selectedAnnounce.attachments }
    onDelete('announcements', selected, firebase, deleteConfirmToggle, snackbarMessage); 
  }

  return (
    <>
      <AdminComposeDialog 
        isEdit={true} 
        formType="announce" 
        open={editOpen} 
        onClose={editToggle} 
        setSnackbarMessage={snackbarMessage} 
        prevContent={selectedAnnounce}/>

      <DeleteConfirmation 
        deleteType='announce' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align='center'>Title</TableCell>
            <TableCell align='center'>Last Updated At</TableCell>
            <TableCell align='center'>Edit</TableCell>
            <TableCell align='center'>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfAnnouncements.map((announce, i) => (
            <TableRow key={i} hover>
              <TableCell align='center'>{announce.title}</TableCell>
              <TableCell align='center'>{format(announce.updatedAt, "Pp")}</TableCell>
              <TableCell align='center'>
                <IconButton name='edit' id={announce.id} color="secondary" onClick={toggleClickAction}>
                  <Edit fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton name='delete' id={announce.id} color="secondary" onClick={toggleClickAction}>
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