import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Clear, Edit } from "@material-ui/icons";
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
    const selected = { id: selectedArticle.id, upload: selectedArticle.image }
    onDelete('articles', selected, firebase, deleteConfirmToggle, snackbarMessage); 
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
            <TableCell align='center'>Author</TableCell>
            <TableCell align='center'>Title</TableCell>
            <TableCell align='center'>Tag</TableCell>
            <TableCell align='center'>Last Updated At</TableCell>
            <TableCell align='center'>Edit</TableCell>
            <TableCell align='center'>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfArticles.map((article, i) => (
            <TableRow key={i} hover>
              <TableCell align='center'>{article.authorDisplayName}</TableCell>
              <TableCell align='center'>{article.title}</TableCell>
              <TableCell align='center'>{article.tag}</TableCell>
              <TableCell align='center'>{format(article.updatedAt, "Pp")}</TableCell>
              <TableCell align='center'>
                <IconButton name='edit' id={article.id} color="secondary" onClick={toggleClickAction}>
                  <Edit fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell align='center'>
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