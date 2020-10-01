import React, { useState } from "react";
import { Avatar, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank, Clear, EditOutlined } from "@material-ui/icons";
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

  const deleteSchool = async () => {
    const deleteStorageResource = firebase.refFromUrl(selectedSchool.image).delete();
    const deleteSchool =  firebase.deleteSchool(selectedSchool.id);

    try {
      await Promise.all([deleteStorageResource, deleteSchool]);
      deleteConfirmToggle();
      snackbarMessage('School deleted successfully!');
    } catch (err) {
      console.log(err.message)
    }
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
        handleDelete={deleteSchool} 
        onClose={deleteConfirmToggle}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Featured</TableCell>
            <TableCell>Recommended</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfSchools.map((school, i) => (
            <TableRow key={i} hover>
              <TableCell>
                <Avatar alt="School Logo" src={(school.image.includes('firebase')) ? school.image : require(`../../assets/img/${school.image}`)}/>
              </TableCell>
              <TableCell>{school.title}</TableCell>
              <TableCell>{school.type}</TableCell>
              <TableCell>{school.location}</TableCell>
              <TableCell>{school.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>{school.isRecommended ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setEditSchool(school.id)}>
                  <EditOutlined/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setDeleteSchool(school.id)}>
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

export default withFirebase(Schools);