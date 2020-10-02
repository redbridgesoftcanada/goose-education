import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function Networking(props) {
  const { firebase, listOfArticles, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle, editOpen, editToggle } = props;

  const [ selectedArticle, setSelectedArticle ] = useState(null);

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const articleData = listOfArticles.find(article => article.id === event.currentTarget.id);
    setSelectedArticle(articleData);
    (actionType === 'edit') ? editToggle() : deleteConfirmToggle();
  }

  const handleDelete = () => {
    const deleteDoc = firebase.deleteArticle(selectedArticle.id);
    onDelete(selectedArticle.image, firebase, deleteDoc, deleteConfirmToggle, snackbarMessage);
  }

  return (
    <>
      <AdminComposeDialog 
        formType="article" 
        isEdit={true} 
        open={editOpen} 
        onClose={editToggle} 
        setSnackbarMessage={snackbarMessage} 
        prevContent={selectedArticle}/>

      <DeleteConfirmation 
        deleteType='article' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Tag</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfArticles.map((article, i) => (
            <TableRow key={i} hover>
              <TableCell>{article.authorDisplayName}</TableCell>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.tag}</TableCell>
              <TableCell>{format(article.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <IconButton name='edit' id={article.id} color="secondary" onClick={toggleClickAction}>
                  <EditOutlined fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton name='delete' id={article.id} color="secondary" onClick={toggleClickAction}>
                  <Clear fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(Networking);