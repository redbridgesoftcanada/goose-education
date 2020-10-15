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
          <TableCell align='center'>First Name</TableCell>
          <TableCell align='center'>Last Name</TableCell>
          <TableCell align='center'>Arrival Flight</TableCell>
          <TableCell align='center'>Arrival Date</TableCell>
          <TableCell align='center'>Departure Flight</TableCell>
          <TableCell align='center'>Departure Date</TableCell>
          <TableCell align='center'>Delete</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfAirportRides.map((application, i) => (
          <TableRow key={i} hover>
            <TableCell align='center'>{application.firstName}</TableCell>
            <TableCell align='center'>{application.lastName}</TableCell>
            <TableCell align='center'>{application.arrivalFlightName}</TableCell>
            <TableCell align='center'>{format(application.arrivalFlightDate.toDate(), "Pp")}</TableCell>
            <TableCell align='center'>{application.departureFlightName}</TableCell>
            <TableCell align='center'>{format(application.departureFlightDate.toDate(), "Pp")}</TableCell>
            <TableCell align='center'>
              <IconButton id={application.id} color="secondary" onClick={setDeleteApplication}>
                <Clear fontSize='small'/>
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