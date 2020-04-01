import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab, Typography } from "@material-ui/core";
import { Add, Delete, Edit, Launch } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../firebase";
import TabPanel from '../TabPanel';
import { TAGS } from '../../constants/constants';
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';

function createTabPanel(selectedTab, articles, dispatchMethods) {
  const { handleRedirect, setEditArticle, setDeleteArticle } = dispatchMethods;
  const tabArticles = articles[selectedTab];
  return (
    <TabPanel value={selectedTab} index={selectedTab} key={selectedTab}>
      {(tabArticles && tabArticles.length) ? 
        <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Tag</TableCell>
            <TableCell>Last Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tabArticles.map((article, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{article.authorDisplayName}</TableCell>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.tag}</TableCell>
              <TableCell>{format(article.updatedAt, "Pp")}</TableCell>
              <TableCell>
                <Button size="small" variant="contained" color="secondary" startIcon={<Launch/>} onClick={() => handleRedirect(article.id)}>View</Button>
                <Button size="small" variant="contained" color="secondary" startIcon={<Edit/>} onClick={() => setEditArticle(article.id)}>Edit</Button>
                <Button size="small" variant="contained" color="secondary" startIcon={<Delete/>} onClick={() => setDeleteArticle(article.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      : 
      <Typography variant='subtitle1'>There are currently no articles on this topic.</Typography> }
    </TabPanel>
  )
}

function Networking(props) {
  const { state, dispatch, listOfArticles, firebase, history } = props;

  const [ selectedArticle, setSelectedArticle ] = useState(null);
  const [ selectedTab, setSelectedTab ] = useState(0); 
  const tabArticles = listOfArticles[selectedTab];

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});
  const toggleComposeDialog = () => dispatch({type: 'TOGGLE_COMPOSE_DIALOG'});
  const toggleEditDialog = () => dispatch({type: 'TOGGLE_EDIT_DIALOG'});
  const toggleDeleteConfirm = () => dispatch({type: 'DELETE_CONFIRM'});
  
  const handleRedirect = id => {
    setSelectedArticle(listOfArticles.find(article => article.id === id));
    const redirectPath = {
      pathname: `/networking/`, 
      state: {
        title: 'Networking',
        selected: 0,
        selectedArticle: selectedArticle
      }
    }
    history.push(redirectPath);
  }

  const setEditArticle = id => {
    setSelectedArticle(tabArticles.find(article => article.id === id));
    toggleEditDialog();
  }
  
  const setDeleteArticle = id => {
    setSelectedArticle(tabArticles.find(article => article.id === id));
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

  const dispatchMethods = { handleRedirect, setEditArticle, setDeleteArticle }
  return (
    <>
      {/* C R E A T E */}
      <Button size="small" variant="contained" color="secondary" startIcon={<Add/>} onClick={toggleComposeDialog}>Create</Button>
      <AdminComposeDialog formType="article" isEdit={false} open={state.composeDialogOpen} onClose={toggleComposeDialog} setSnackbarMessage={setSnackbarMessage}/>

      {/* E D I T */}
      <AdminComposeDialog formType="article" isEdit={true} open={state.editDialogOpen} onClose={toggleEditDialog} setSnackbarMessage={setSnackbarMessage} prevContent={selectedArticle}/>

      {/* D E L E T E */}
      <DeleteConfirmation deleteType='article' open={state.deleteConfirmOpen} 
      handleDelete={deleteArticle} 
      onClose={toggleDeleteConfirm}/>

      <Tabs
        value={selectedTab}
        onChange={(event, value) => setSelectedTab(value)}
        textColor="secondary"
        // centered
        variant="scrollable"
        scrollButtons="on"
      >
        {TAGS.map((tab, i) => <Tab key={i} label={tab}/>)}
      </Tabs>
      {createTabPanel(selectedTab, listOfArticles, dispatchMethods)}
    </>
  )
}

export default withFirebase(Networking);