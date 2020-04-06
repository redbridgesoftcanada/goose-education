import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import DeleteConfirmation from '../DeleteConfirmation';

function AirportRides(props) {
  const { state, dispatch, listOfAirportRides, firebase } = props;

  const [ selectedApplication, setSelectedApplication ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setDeleteApplication = id => {
    setSelectedApplication(listOfAirportRides.find(application => application.id === id));
    toggleDeleteConfirm();
  }

  const deleteApplication = () => {
    firebase.deleteAirportRideApplication(selectedApplication.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Application successfully deleted!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Flight</TableCell>
          <TableCell>Arrival Date</TableCell>
          <TableCell>Flight</TableCell>
          <TableCell>Departure Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfAirportRides.map((application, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{application.firstName} {application.lastName}</TableCell>
            <TableCell>{application.arrivalFlightName}</TableCell>
            <TableCell>{application.arrivalFlightDate} {format(application.arrivalFlightTime, "p")}</TableCell>
            <TableCell>{application.departureFlightName}</TableCell>
            <TableCell>{application.departureFlightDate} {format(application.departureFlightTime, "p")}</TableCell>
            <TableCell>
              <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={() => setDeleteApplication(application.authorID)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>

      <DeleteConfirmation deleteType='admin_application' open={state.deleteConfirmOpen} 
      handleDelete={deleteApplication} 
      onClose={toggleDeleteConfirm}/>
    </>
  )
}

export default withFirebase(AirportRides);