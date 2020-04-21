import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab, Typography } from "@material-ui/core";
import { Clear, EditOutlined } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function Networking(props) {
  const { state, dispatch, listOfArticles, firebase } = props;

  // S T A T E
  const [ selectedArticle, setSelectedArticle ] = useState(null);

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});

  const setEditArticle = id => {
    setSelectedArticle(listOfArticles.find(article => article.id === id));
    toggleEditDialog();
  }
  
  const setDeleteArticle = id => {
    setSelectedArticle(listOfArticles.find(article => article.id === id));
    toggleDeleteConfirm();
  }

  const deleteArticle = () => {
    firebase.deleteArticle(selectedArticle.id).then(function() {
     dispatch({type: 'DELETE_CONFIRM'});
     setSnackbarMessage('Article deleted successfully!');
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <>
      {/* E D I T */}
      <AdminComposeDialog formType="article" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage} prevContent={selectedArticle}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='article' open={state.deleteConfirmOpen} 
      handleDelete={deleteArticle} 
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
                <IconButton color="secondary" onClick={() => setEditArticle(article.id)}>
                  <EditOutlined fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => setDeleteArticle(article.id)}>
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