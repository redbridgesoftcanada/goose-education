import React, { useState } from "react";
import { Button, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, CloudDownload } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import { STATUSES } from "../../constants/constants";
import DeleteConfirmation from '../DeleteConfirmation';

function Applications(props) {
  const { state, dispatch, listOfApplications, firebase } = props;

  const [ selectedApplication, setSelectedApplication ] = useState(null);

  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setMenuOpen = event => dispatch({type: 'MENU_OPEN', payload: {
    key: 'anchorApplicationStatus', 
    selected: event.currentTarget }
  });

  const setMenuClose = event => {
    const applicationStatus = event.currentTarget.id;
    if (applicationStatus) {
      dispatch({type: 'MENU_SELECTED', payload: {
        key: 'anchorApplicationStatus', 
        selectedStatus: applicationStatus, 
        firebase }
      });
    } else {
      dispatch({type: 'MENU_CLOSE', payload: 'anchorApplicationStatus'});
    }
  }

  const setDeleteApplication = event => {
    const findApplicationData = listOfApplications.find(application => application.id === event.currentTarget.id);
    setSelectedApplication(findApplicationData);
    toggleDeleteConfirm();
  }

  const deleteApplication = async () => {
    const deleteStorageResource = firebase.refFromUrl(selectedApplication.downloadUrl).delete();
    const deleteDoc =  firebase.deleteSchoolApplication(selectedApplication.id);

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
      <DeleteConfirmation deleteType='admin_application' open={state.deleteConfirmOpen} 
      handleDelete={deleteApplication} 
      onClose={toggleDeleteConfirm}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>School Name</TableCell>
            <TableCell>Program</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Date Submitted</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfApplications.map((application, i) => (
            <TableRow key={i} hover>
              <TableCell>{application.firstName}</TableCell>
              <TableCell>{application.lastName}</TableCell>
              <TableCell>{application.schoolName}</TableCell>
              <TableCell>{application.programName}</TableCell>
              <TableCell>{application.startDate}</TableCell>
              <TableCell>{format(application.createdAt, "Pp")}</TableCell>
              <TableCell>
                <Button id={application.id} onClick={setMenuOpen}>{application.status}</Button>
                <Menu
                  keepMounted
                  anchorEl={state.anchorApplicationStatus}
                  open={Boolean(state.anchorApplicationStatus)}
                  onClose={setMenuClose}
                >
                  {STATUSES.map((status, i) => 
                    <MenuItem key={i} id={status} onClick={setMenuClose}>{status}</MenuItem>
                  )}
                </Menu>
              </TableCell>
              <TableCell>
                <IconButton id={application.id} color="secondary" onClick={setDeleteApplication}>
                  <Clear/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => window.open(application.downloadUrl)}>
                  <CloudDownload/>
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