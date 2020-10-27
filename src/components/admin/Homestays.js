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
    const selected = { id: selectedApplication.id, upload: selectedApplication.downloadUrl}
    onDelete('homestays', selected, firebase, deleteConfirmToggle, snackbarMessage); 
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
          <TableCell align='center'>First Name</TableCell>
          <TableCell align='center'>Last Name</TableCell>
          <TableCell align='center'>Start Date</TableCell>
          <TableCell align='center'>End Date</TableCell>
          <TableCell align='center'>Arrival Date</TableCell>
          <TableCell align='center'>Delete</TableCell>
          <TableCell align='center'>Download</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfHomestays.map(application => {
          return (
          <TableRow key={application.id} hover>
            <TableCell align='center'>{application.firstName}</TableCell>
            <TableCell align='center'>{application.lastName}</TableCell>
            <TableCell align='center'>{format(application.homestayStartDate.toDate(), 'P')}</TableCell>
            <TableCell align='center'>{format(application.homestayEndDate.toDate(), 'P')}</TableCell>
            <TableCell align='center'>{format(application.arrivalFlightDate.toDate(), 'Pp')}</TableCell>
            <TableCell align='center'>
              <IconButton id={application.id} color="secondary" onClick={setDeleteApplication}>
                <Clear fontSize='small'/>
              </IconButton>
            </TableCell>
            <TableCell align='center'>
              {application.downloadUrl &&
                <IconButton color="secondary" onClick={() => window.open(application.downloadUrl)}>
                  <CloudDownload fontSize='small'/>
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