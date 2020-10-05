import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import { onDelete } from '../../constants/helpers/_storage';
import DeleteConfirmation from '../DeleteConfirmation';

function AirportRides(props) {
  const { firebase, listOfAirportRides, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle } = props;

  const [ selectedApplication, setSelectedApplication ] = useState(null);

  const setDeleteApplication = event => {
    setSelectedApplication(listOfAirportRides.find(application => application.id === event.currentTarget.id));
    deleteConfirmToggle();
  }

  const handleDelete = () => {
    const deleteDoc = firebase.deleteAirportRideApplication(selectedApplication.id);
    onDelete(selectedApplication.downloadUrl, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
  }

  return (
    <>
      <DeleteConfirmation 
        deleteType='admin_application'
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

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
          <TableRow key={i} hover>
            <TableCell>{application.firstName}</TableCell>
            <TableCell>{application.lastName}</TableCell>
            <TableCell>{application.arrivalFlightName}</TableCell>
            <TableCell>{format(application.arrivalFlightDate.toDate(), "Pp")}</TableCell>
            <TableCell>{application.departureFlightName}</TableCell>
            <TableCell>{format(application.departureFlightDate.toDate(), "Pp")}</TableCell>
            <TableCell>
              <IconButton id={application.id} color="secondary" onClick={setDeleteApplication}>
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