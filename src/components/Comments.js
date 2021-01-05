import React, { Fragment, useState, useContext } from 'react';
import { Button, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVertOutlined } from '@material-ui/icons';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useHistory } from 'react-router-dom';
import { format, compareAsc } from 'date-fns';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { AuthUserContext } from '../components/session';
import { StateContext, DispatchContext } from '../components/userActions';
import { withFirebase } from '../components/firebase';
import CommentDialog from '../components/CommentDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';
import StyledValidators from '../components/customMUI';
import useStyles from '../styles/constants';

function CommentsFormField({ firebase }) {
  const authUser = useContext(AuthUserContext);
  const stateContext = useContext(StateContext);
  const { dispatch, setNotification } = useContext(DispatchContext);
  const history = useHistory();
  const classes = useStyles({}, 'comments');
  
  const [ comment, setComment ] = useState('');
  
  const onSubmit = async event => {
    try {
      await firebase.article(stateContext.articleSelect.id).update({ 
        "comments": 
          firebase.updateArray().arrayUnion({
            id: uuidv4(),
            authorDisplayName: authUser.displayName,
            authorID: authUser.uid,
            description: comment,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
        }); 
        history.push({ pathname: '/networking', state: { selected: 0 } });
        dispatch({ type:'userActionsReset' });
        setNotification({ action: 'success', message: 'Comment has been saved.' });
    } catch (err) {
      setNotification({ action: 'error', message: 'Comment could not be saved. We will try and fix this issue.' });
    }
    event.preventDefault();
  }

  return (
    <ValidatorForm onSubmit={onSubmit}>
      <StyledValidators.TextField
        onChange={event => setComment(event.target.value)}
        multiline
        rows={5}
        value={comment}
        validators={['isQuillEmpty']}
        errorMessages={['']}/>
      <Button className={classes.commentButton} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
    </ValidatorForm>
  )
}

function Comments({ firebase, formType, formKey, resetAllActions }) {
  const authUser = useContext(AuthUserContext);
  const stateContext = useContext(StateContext);

  const [ state, setState ] = useState({
    formType: formType,
    selectedResource: stateContext[formKey],
    listOfComments: stateContext[formKey].comments,
    selectedComment: null,
    selectedCommentBody: '',
    commentAnchor: null,
    commentConfirmOpen: false,
    commentDialogOpen: false,
  });

  const handleMenuOpen = e => setState(prevState => ({ ...prevState, commentAnchor: e.currentTarget }));

  const handleMenuClose = () => setState(prevState => ({ ...prevState, commentAnchor: null }));

  const handleChange = e => {
    const userInput = e.currentTarget.value;
    setState(prevState => ({ ...prevState, selectedCommentBody: userInput }));
  }
  
  const handleCancel = () => setState(prevState => ({ ...prevState, selectedComment: null, commentDialogOpen: !state.commentDialogOpen }));

  const handleDeleteConfirmation = e => setState(prevState => ({ ...prevState, commentConfirmOpen: !state.commentConfirmOpen }));

  const handleEdit = () => {
    const commentMatch = state.listOfComments.find(comment => comment.id === state.commentAnchor.id);
    setState(prevState => ({ 
      ...prevState, 
      selectedComment: commentMatch, 
      selectedCommentBody: commentMatch.description, 
      commentAnchor: null, 
      commentDialogOpen: !prevState.commentDialogOpen
    }));
  }

  const onSubmit = async e => {
    const docRef = configFirebaseRef(firebase, state.formType, state.selectedResource.id);
    try {
      await firebase.transaction(async t => {
        const doc = await t.get(docRef);

        const commentsArr = doc.data().comments;
        const filteredCommentsArr = commentsArr.filter(comment => comment.id !== state.selectedComment.id);
        
        const selectedComment = commentsArr.find(comment => comment.id === state.selectedComment.id);
        selectedComment.description = state.selectedCommentBody;
        selectedComment.updatedAt = Date.now();

        filteredCommentsArr.push(selectedComment);
        await t.update(docRef, { comments: filteredCommentsArr });
      });

      setState(prevState => ({ 
        ...prevState, 
        selectedComment: null,
        selectedCommentBody: '', 
        commentDialogOpen: !prevState.commentDialogOpen 
      }));

      resetAllActions('success', 'Comment has been saved.');

    } catch (err) {
      resetAllActions('error', 'Comment could not be saved. We will try and fix this issue.');
    }

    e.preventDefault();
  }

  const onDelete = async e => {
    const docRef = configFirebaseRef(firebase, state.formType, state.selectedResource.id);

    try {
      await firebase.transaction(async t => {
        const doc = await t.get(docRef)
        const commentsArr = doc.data().comments;

        const filteredCommentsArr = commentsArr.filter(comment => comment.id !== state.commentAnchor.id);

        await t.update(docRef, { comments: filteredCommentsArr });
      });

      setState(prevState => ({ 
        ...prevState, 
        commentAnchor: null,
        commentConfirmOpen: !prevState.commentConfirmOpen 
      }));
      resetAllActions('success', 'Comment has been deleted.');

    } catch (err) {
      resetAllActions('error', 'Comment could not be deleted. We will try and fix this issue.');
    }
  }

  const classes = useStyles({}, 'comments');

  return (
    state.listOfComments.map(comment => {
      const isCommentOwner = authUser && authUser.uid === comment.authorID;
      return (
        <Fragment key={comment.id}>
          <Grid container className={classes.container}>
            <Grid container item xs={6} className={classes.fsContainer}>
              <Typography className={classes.metaAuthor} color='secondary'>{comment.authorDisplayName}</Typography>
            </Grid>

            <Grid container item xs={6} className={classes.feContainer}>
              <Typography className={classes.metaDate}>
                {format([comment.createdAt, comment.updatedAt].sort(compareAsc).pop(), 'Pp')}
              </Typography>
            </Grid>

            <Grid container item xs={11} className={classes.fsContainer}>
              {!state.selectedComment || state.selectedComment.id !== comment.id ? 
                <Typography className={classes.commentText}>{parse(comment.description)}</Typography>
                :
                state.selectedComment.id === comment.id &&
                <CommentDialog 
                  commentBody={state.selectedCommentBody} 
                  handleChange={handleChange}
                  onClose={handleCancel}
                  onSubmit={onSubmit}/>
              }
            </Grid>

            {isCommentOwner &&
              <Grid container item xs={1} className={classes.feContainer}>
                <IconButton id={comment.id} onClick={handleMenuOpen}>
                  <MoreVertOutlined fontSize='small'/>
                </IconButton>
              </Grid>
            }
          </Grid>

          {/* Conditional Components - Edit + Delete Features */}
          {isCommentOwner &&
            <>
              <Menu
                keepMounted
                anchorEl={state.commentAnchor}
                open={!!state.commentAnchor}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit Comment</MenuItem>
                <MenuItem onClick={handleDeleteConfirmation}>Delete Comment</MenuItem>
              </Menu>
                  
              <DeleteConfirmation 
                deleteType='comment' 
                open={state.commentConfirmOpen} 
                handleDelete={onDelete} 
                onClose={handleDeleteConfirmation}/>
            </>
          }
        </Fragment>
      )  
    })
  )
}

function configFirebaseRef(firebase, formType, resourceId) {
  switch(formType) {
    case 'announcement':
      return firebase.announcement(resourceId);
      
    case 'message':
      return firebase.message(resourceId);

    case 'article':
      return firebase.article(resourceId);

    default:
      console.log('Missing formType to set collection reference in Firebase.');
      return;
  }
}

export const CommentField = withFirebase(CommentsFormField);
export default withFirebase(Comments);