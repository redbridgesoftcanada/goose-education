import React, { useState } from "react";
import { Button, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Delete, CloudDownload } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import { STATUSES } from "../../constants/constants";
import DeleteConfirmation from '../DeleteConfirmation';

function Applications(props) {
  const { state, dispatch, listOfApplications, firebase } = props;

  const [ selectedApplication, setSelectedApplication ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setMenuOpen = event => dispatch({type: 'MENU_OPEN', payload: {
    key: 'anchorApplicationStatus', 
    selected: event.currentTarget }
  });

  const setMenuClose = (event, authorId) => {
    if (authorId) {
      dispatch({type: 'MENU_SELECTED', payload: {
        key: 'anchorApplicationStatus', 
        selectedStatus: event.currentTarget.id,
        authorId, 
        firebase }
      });
    } else {
      dispatch({type: 'MENU_CLOSE', payload: 'anchorApplicationStatus'});
    }
  }

  const setDeleteApplication = id => {
    setSelectedApplication(listOfApplications.find(application => application.authorID === id));
    toggleDeleteConfirm();
  }

  const deleteApplication = () => {
    firebase.deleteSchoolApplication(selectedApplication.authorID).then(function() {
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
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {listOfApplications.map((application, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{application.firstName} {application.lastName}</TableCell>
            <TableCell>{format(application.createdAt, "Pp")}</TableCell>
            <TableCell>
              <Button onClick={setMenuOpen}>{application.status}</Button>
              <Menu
                keepMounted
                anchorEl={state.anchorApplicationStatus}
                open={Boolean(state.anchorApplicationStatus)}
                onClose={event => setMenuClose(event, null)}
              >
                {STATUSES.map((status, i) => {
                  return (
                    <MenuItem key={i} id={status} onClick={event => setMenuClose(event, application.authorID)}>{status}</MenuItem>
                  )
                })}
              </Menu>
            </TableCell>
            <TableCell>
              <Button size="small" variant="contained" color="secondary" startIcon={<CloudDownload/>} onClick={()=>console.log('Clicked')}>Download</Button>
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

export default withFirebase(Applications);