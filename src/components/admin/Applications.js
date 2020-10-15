import React, { useState, useRef } from "react";
import { Button, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import { STATUSES } from "../../constants/constants";
import { onDelete } from '../../constants/helpers/_storage';
import DeleteConfirmation from '../DeleteConfirmation';

function Applications(props) {
  const { firebase, listOfApplications, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle } = props;

  const applicationRef = useRef(null);
  const [ selectedApplication, setSelectedApplication ] = useState(null);

  const setMenuOpen = event => setSelectedApplication(event.currentTarget);

  const setMenuClose = event => {
    applicationRef.current = listOfApplications.find(application => application.id === selectedApplication.id);
    const selectedStatus = event.currentTarget.id
    const isDuplicate = selectedStatus && applicationRef.current.status === selectedStatus;

    const cleanupActions = message => {
      snackbarMessage(message);
      setSelectedApplication(null);
    }

    if (isDuplicate) {
      cleanupActions('Same application status - no changes have been saved.');
    } else if (!isDuplicate && selectedStatus) {
      firebase.schoolApplication(selectedApplication.id).update({ status: selectedStatus })
      .then(() => cleanupActions(`Application status has been updated to ${selectedStatus}.`));
    } else {
      setSelectedApplication(null);
    }
  }

  const setDeleteApplication = event => {
    applicationRef.current = listOfApplications.find(application => application.id === event.currentTarget.id);
    deleteConfirmToggle();
  }

  const handleDelete = () => {
    const { id, downloadUrl } = applicationRef.current;
    const deleteDoc = firebase.deleteSchoolApplication(id);
    onDelete(downloadUrl, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
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
            <TableCell align='center'>School</TableCell>
            <TableCell align='center'>Program</TableCell>
            <TableCell align='center'>Start Date</TableCell>
            <TableCell align='center'>Date Submitted</TableCell>
            <TableCell align='center'>Status</TableCell>
            <TableCell align='center'>Delete</TableCell>
            <TableCell align='center'>Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfApplications.map((application, i) => (
            <TableRow key={i} hover>
              <TableCell align='center'>{application.firstName}</TableCell>
              <TableCell align='center'>{application.lastName}</TableCell>
              <TableCell align='center'>{application.schoolName}</TableCell>
              <TableCell align='center'>{application.programName}</TableCell>
              <TableCell align='center'>{format(application.programStartDate.toDate(), "P")}</TableCell>
              <TableCell align='center'>{format(application.createdAt, "Pp")}</TableCell>
              <TableCell align='center'>
                <Button id={application.id} onClick={setMenuOpen}>{application.status}</Button>
                <Menu
                  keepMounted
                  anchorEl={selectedApplication}
                  open={Boolean(selectedApplication)}
                  onClose={setMenuClose}
                >
                  {STATUSES.map((status, i) => 
                    <MenuItem key={i} id={status} onClick={setMenuClose}>{status}</MenuItem>
                  )}
                </Menu>
              </TableCell>
              <TableCell align='center'>
                <IconButton id={application.id} color="secondary" onClick={setDeleteApplication}>
                  <Clear fontSize='small'/>
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton color="secondary" onClick={() => window.open(application.downloadUrl)}>
                  <CloudDownload fontSize='small'/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Applications);