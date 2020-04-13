import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Clear, Edit, PageviewOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function GooseTips(props) {
  const { state, dispatch, listOfTips, firebase, history } = props;

  // S T A T E
  const [ selectedTip, setSelectedTip ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const togglePreviewDialog = () => dispatch({type: 'TOGGLE_PREVIEW_DIALOG'});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setEditTip = id => {
    setSelectedTip(listOfTips.find(school => school.id === id));
    toggleEditDialog();
  }
  
  const setDeleteTip = id => {
    setSelectedTip(listOfTips.find(school => school.id === id));
    toggleDeleteConfirm();
  }

  const deleteTip = () => {
    firebase.deleteTip(selectedTip.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Tip deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* E D I T */}
      <AdminComposeDialog 
        formType="tip" 
        isEdit={true} 
        open={state.editDialogOpen} 
        onClose={toggleEditDialog} 
        setSnackbarMessage={setSnackbarMessage} 
        prevContent={selectedTip}/>

      {/* D E L E T E */}
      <DeleteConfirmation 
        deleteType='admin_tip' 
        open={state.deleteConfirmOpen} 
        handleDelete={deleteTip} 
        onClose={toggleDeleteConfirm}/>

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
            <TableRow key={i}>
              <TableCell>{tip.title}</TableCell>
              <TableCell>{tip.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>{format(tip.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setEditTip(tip.id)}>
                  <Edit/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setDeleteTip(tip.id)}>
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