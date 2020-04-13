import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import DeleteConfirmation from '../DeleteConfirmation';

function AirportRides(props) {
  const { state, dispatch, listOfAirportRides, firebase } = props;

  // S T A T E
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
      {/* D E L E T E */}
      <DeleteConfirmation deleteType='admin_application' open={state.deleteConfirmOpen} 
      handleDelete={deleteApplication} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>Arrival Flight</TableCell>
          <TableCell>Arrival Date</TableCell>
          <TableCell>Departure Flight</TableCell>
          <TableCell>Departure Date</TableCell>
          <TableCell>Delete</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfAirportRides.map((application, i) => (
          <TableRow key={i}>
            <TableCell>{application.firstName}</TableCell>
            <TableCell>{application.lastName}</TableCell>
            <TableCell>{application.arrivalFlightName}</TableCell>
            <TableCell>{application.arrivalFlightDate} {format(application.arrivalFlightTime, "p")}</TableCell>
            <TableCell>{application.departureFlightName}</TableCell>
            <TableCell>{application.departureFlightDate} {format(application.departureFlightTime, "p")}</TableCell>
            <TableCell>
              <IconButton color="secondary" onClick={() => setDeleteApplication(application.authorID)}>
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

export default withFirebase(AirportRides);