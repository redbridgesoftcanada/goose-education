import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload } from "@material-ui/icons";
import { withFirebase } from "../firebase";
import DeleteConfirmation from '../DeleteConfirmation';

function Homestays(props) {
  const { state, dispatch, listOfHomestays, firebase } = props;

  // S T A T E
  const [ selectedApplication, setSelectedApplication ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setDeleteApplication = id => {
    setSelectedApplication(listOfHomestays.find(application => application.id === id));
    toggleDeleteConfirm();
  }

  const deleteApplication = () => {
    firebase.deleteHomestayApplication(selectedApplication.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Application successfully deleted!');
    }).catch(function(error) {
      console.log(error)
    });
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
          <TableCell>Arrival Flight</TableCell>
          <TableCell>Delete</TableCell>
          <TableCell>Download</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfHomestays.map((application, i) => {
          const formattedArrivalTime = application.arrivalFlightTime.toDate().toString();
          return (
          <TableRow key={i} hover>
            <TableCell>{application.firstName}</TableCell>
            <TableCell>{application.lastName}</TableCell>
            <TableCell>{application.homestayStartDate}</TableCell>
            <TableCell>{application.homestayEndDate}</TableCell>
            <TableCell>{application.arrivalFlightDate} {formattedArrivalTime}</TableCell>
            <TableCell>
              <IconButton color="secondary" onClick={() => setDeleteApplication(application.authorID)}>
                <Clear/>
              </IconButton>
            </TableCell>
            <TableCell>
              <IconButton color="secondary" onClick={()=>console.log('Clicked')}>
                <CloudDownload/>
              </IconButton>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Homestays);