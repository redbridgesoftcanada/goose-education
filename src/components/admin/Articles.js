import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function Networking(props) {
  const { dispatch, listOfArticles, firebase } = props;

  const [ selectedArticle, setSelectedArticle ] = useState(null);

  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const articleData = listOfArticles.find(article => article.id === event.currentTarget.id);
    setSelectedArticle(articleData);
    (actionType === 'edit') ? toggleEditDialog() : toggleDeleteConfirm();
  }

  const handleDelete = () => onDelete(selectedArticle.id, selectedArticle.image, firebase, toggleDeleteConfirm, setSnackbarMessage);

  return (
    <>
      <AdminComposeDialog 
        formType="article" 
        isEdit={true} 
        open={(props.state) ? props.state.editDialogOpen : false } 
        onClose={toggleEditDialog} 
        setSnackbarMessage={setSnackbarMessage} 
        prevContent={selectedArticle}/>

      <DeleteConfirmation 
        deleteType='article' 
        open={(props.state) ? props.state.deleteConfirmOpen : false} 
        handleDelete={handleDelete} 
        onClose={toggleDeleteConfirm}/>

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