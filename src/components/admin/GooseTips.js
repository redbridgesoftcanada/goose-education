import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Clear, Edit } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function GooseTips(props) {
  const { firebase, listOfTips, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle, editOpen, editToggle } = props;

  const [ selectedTip, setSelectedTip ] = useState(null);

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const tipData = listOfTips.find(tip => tip.id === event.currentTarget.id);
    setSelectedTip(tipData);
    (actionType === 'edit') ? editToggle() : deleteConfirmToggle();
  }

  const handleDelete = () => {
    const deleteDoc = firebase.deleteTip(selectedTip.id);
    onDelete(selectedTip.image, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
  }

  return (
    <>
      <AdminComposeDialog 
        formType="tip" 
        isEdit={true} 
        open={editOpen} 
        onClose={editToggle} 
        setSnackbarMessage={snackbarMessage} 
        prevContent={selectedTip}/>

      <DeleteConfirmation 
        deleteType='admin_tip' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Featured</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfTips.map((tip, i) => (
            <TableRow key={i} hover>
              <TableCell>{tip.title}</TableCell>
              <TableCell>{tip.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>{format(tip.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton name='edit' id={tip.id} color="secondary" onClick={toggleClickAction}>
                  <Edit/> 
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton name='delete' id={tip.id} color="secondary" onClick={toggleClickAction}>
                  <Clear/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(GooseTips);