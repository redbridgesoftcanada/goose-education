import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload } from "@material-ui/icons";
import { format } from 'date-fns';
import { withFirebase } from "../firebase";
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function Homestays(props) {
  const { firebase, listOfHomestays, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle } = props;

  const [ selectedApplication, setSelectedApplication ] = useState(null);

  const setDeleteApplication = event => {
    const findHomestayData = listOfHomestays.find(application => application.id === event.currentTarget.id)
    setSelectedApplication(findHomestayData);
    deleteConfirmToggle();
  }

  const handleDelete = () => {
    const deleteDoc = firebase.deleteHomestayApplication(selectedApplication.id);
    onDelete(selectedApplication.downloadUrl, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
  }

  return (
    <>
      {/* D E L E T E */}
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