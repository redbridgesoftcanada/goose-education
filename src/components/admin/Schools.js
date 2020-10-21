import React, { useState } from "react";
import { Avatar, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Check, Block, Clear, Edit } from "@material-ui/icons";
import { onDelete } from '../../constants/helpers/_storage';
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Schools(props) {
  const { firebase, listOfSchools, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle, editOpen, editToggle } = props;

  const [ selectedSchool, setSelectedSchool ] = useState(null);

  const setEditSchool = id => {
    setSelectedSchool(listOfSchools.find(school => school.id === id));
    editToggle();
  }
  
  const setDeleteSchool = id => {
    setSelectedSchool(listOfSchools.find(school => school.id === id));
    deleteConfirmToggle();
  }

  const handleDelete = () => {
    const deleteDoc = firebase.deleteSchool(selectedSchool.id);
    onDelete(selectedSchool.image, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
  }

  return (
    <>
      <AdminComposeDialog 
        prevContent={selectedSchool} 
        formType="school" 
        isEdit={true} 
        open={editOpen} 
        onClose={editToggle} 
        setSnackbarMessage={snackbarMessage}/>

      <DeleteConfirmation 
        deleteType='admin_school' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align='center' colSpan={2}>Name</TableCell>
            <TableCell align='center'>Type</TableCell>
            <TableCell align='center'>Location</TableCell>
            <TableCell align='center'>Featured</TableCell>
            <TableCell align='center'>Recommended</TableCell>
            <TableCell align='center'>Edit</TableCell>
            <TableCell align='center'>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfSchools.map((school, i) => (
            <TableRow key={i} hover>
              <TableCell>
                <Avatar variant='rounded' src={school.image}/>
              </TableCell>
              <TableCell>{school.title}</TableCell>
              <TableCell align='center'>{school.type}</TableCell>
              <TableCell align='center'>{school.location}</TableCell>
              <TableCell align='center'>{school.isFeatured ? <Check fontSize='small'/> : <Block fontSize='small'/>}</TableCell>
              <TableCell align='center'>{school.recommendation ? <Check fontSize='small'/> : <Block fontSize='small'/>}</TableCell>
              <TableCell align='center'>
                <IconButton color="secondary" onClick={() => setEditSchool(school.id)}>
                  <Edit fontSize='small'/>
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton color="secondary" onClick={() => setDeleteSchool(school.id)}>
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

export default withFirebase(Schools);