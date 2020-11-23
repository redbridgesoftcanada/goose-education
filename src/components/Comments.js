import React, { Fragment, useState, useContext } from 'react';
import { Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVertOutlined } from '@material-ui/icons';
import { format, compareAsc } from 'date-fns';
import parse from 'html-react-parser';
import { AuthUserContext } from '../components/session';
import { StateContext } from '../components/userActions';
import { withFirebase } from '../components/firebase';
import CommentDialog from '../components/CommentDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';
import useStyles from '../styles/constants';

function Comments({ firebase, formType, resetAllActions }) {
  const authUser = useContext(AuthUserContext);
  const stateContext = useContext(StateContext);

  const [ state, setState ] = useState({
    formType: formType,
    selectedResource: stateContext.articleSelect,
    listOfComments: stateContext.articleSelect.comments,
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
        // return 'Completed update transaction of comments for content and date.';
      });

      setState(prevState => ({ 
        ...prevState, 
        selectedComment: null,
        selectedCommentBody: '', 
        commentDialogOpen: !prevState.commentDialogOpen 
      }));

      // Translation: 'Comment has been saved.'
      resetAllActions('success', '댓글이 저장되었습니다.');

    } catch (err) {
      // Translation: 'Comment could not be saved. We will try and fix this issue.'
      resetAllActions('error', '댓글을 저장할 수 없습니다. 이 문제를 해결하려고 노력할 것입니다.');
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
        // return 'Completed remove/delete transaction of comments.'
      });

      setState(prevState => ({ 
        ...prevState, 
        commentAnchor: null,
        commentConfirmOpen: !prevState.commentConfirmOpen 
      }));

      // Translation: 'Comment has been deleted.'
      resetAllActions('success', '댓글이 삭제되었습니다.');

    } catch (err) {
      // Translation: 'Comment could not be deleted. We will try and fix this issue.'
      resetAllActions('error', '댓글을 삭제할 수 없습니다. 이 문제를 해결하려고 노력할 것입니다.');
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

export default withFirebase(Comments);