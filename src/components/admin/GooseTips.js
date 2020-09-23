import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Clear, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function GooseTips(props) {
  const { dispatch, listOfTips, firebase } = props;

  const [ selectedTip, setSelectedTip ] = useState(null);

  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setEditTip = event => {
    const findTipData = listOfTips.find(tip => tip.id === event.currentTarget.id);
    setSelectedTip(findTipData);
    toggleEditDialog();
  }
  
  const setDeleteTip = event => {
    const findTipData = listOfTips.find(tip => tip.id === event.currentTarget.id);
    setSelectedTip(findTipData);
    toggleDeleteConfirm();
  }

  const deleteTip = async () => {
    const deleteStorageResource = firebase.refFromUrl(selectedTip.downloadUrl).delete();
    const deleteDoc =  firebase.deleteTip(selectedTip.id);

    try {
      await Promise.all([deleteStorageResource, deleteDoc]);
      dispatch({type: 'DELETE_CONFIRM'});
      setSnackbarMessage('Tip successfully deleted!');
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <AdminComposeDialog 
        formType="tip" 
        isEdit={true} 
        open={props.state.editDialogOpen} 
        onClose={toggleEditDialog} 
        setSnackbarMessage={setSnackbarMessage} 
        prevContent={selectedTip}/>

      <DeleteConfirmation 
        deleteType='admin_tip' 
        open={props.state.deleteConfirmOpen} 
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
            <TableRow key={i} hover>
              <TableCell>{tip.title}</TableCell>
              <TableCell>{tip.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>{format(tip.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton id={tip.id} color="secondary" onClick={setEditTip}>
                  <EditOutlined/> 
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton id={tip.id} color="secondary" onClick={setDeleteTip}>
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