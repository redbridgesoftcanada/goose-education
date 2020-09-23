import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload } from "@material-ui/icons";
import { format, parseISO } from 'date-fns';
import { withFirebase } from "../firebase";
import DeleteConfirmation from '../DeleteConfirmation';

function Homestays(props) {
  const { state, dispatch, listOfHomestays, firebase } = props;

  // S T A T E
  const [ selectedApplication, setSelectedApplication ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setDeleteApplication = event => {
    const findHomestayData = listOfHomestays.find(application => application.id === event.currentTarget.id)
    setSelectedApplication(findHomestayData);
    toggleDeleteConfirm();
  }

  const deleteApplication = async () => {
    const deleteStorageResource = firebase.refFromUrl(selectedApplication.downloadUrl).delete();
    const deleteDoc =  firebase.deleteHomestayApplication(selectedApplication.id);
    try {
      await Promise.all([deleteStorageResource, deleteDoc]);
      dispatch({type: 'DELETE_CONFIRM'});
      setSnackbarMessage('Application successfully deleted!');
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      {/* D E L E T E */}
      <DeleteConfirmation deleteType='admin_application' open={state.deleteConfirmOpen} 
      handleDelete={deleteApplication} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
          <TableCell>Arrival Date</TableCell>
          <TableCell>Delete</TableCell>
          <TableCell>Download</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfHomestays.map(application => {
          return (
          <TableRow key={application.id} hover>
            <TableCell>{application.firstName}</TableCell>
            <TableCell>{application.lastName}</TableCell>
            <TableCell>{format(application.homestayStartDate.toDate(), 'P')}</TableCell>
            <TableCell>{format(application.homestayEndDate.toDate(), 'P')}</TableCell>
            <TableCell>{format(application.arrivalFlightDate.toDate(), 'Pp')}</TableCell>
            <TableCell>
              <IconButton id={application.id} color="secondary" onClick={setDeleteApplication}>
                <Clear/>
              </IconButton>
            </TableCell>
            <TableCell>
              {application.downloadUrl &&
                <IconButton color="secondary" onClick={() => window.open(application.downloadUrl)}>
                  <CloudDownload/>
                </IconButton>
              }
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Homestays);