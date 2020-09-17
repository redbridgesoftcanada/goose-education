import React, { Fragment, useState } from 'react';
import { Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVertOutlined } from '@material-ui/icons';
import { format, compareDesc } from 'date-fns';
import parse from 'html-react-parser';
import { withFirebase } from '../components/firebase';
import CommentDialog from '../components/CommentDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';
import useStyles from '../styles/constants';

function Comments(props) {
  const classes = useStyles(props, 'comments');
  const { authUser, firebase } = props;

  const [ state, setState ] = useState({
    formType: props.formType,
    selectedResource: props.selectedResource,
    listOfComments: props.listOfComments,
    selectedComment: null,
    selectedCommentBody: '',
    commentAnchor: null,
    commentConfirmOpen: false,
    commentDialogOpen: false,
  });

  const handleMenuOpen = e => setState(state => ({ ...state, commentAnchor: e.currentTarget }));
  const handleMenuClose = () => setState(state => ({ ...state, commentAnchor: null }));

  const handleChange = e => {
    const userInput = e.currentTarget.value;
    setState(state => ({ ...state, selectedCommentBody: userInput }));
  }
  
  const handleCancel = () => setState(state => ({ ...state, selectedComment: null, commentDialogOpen: !state.commentDialogOpen }));

  const handleDeleteConfirmation = e => setState(state => ({ ...state, commentConfirmOpen: !state.commentConfirmOpen }));

  const handleEdit = () => {
    const commentMatch = state.listOfComments.find(comment => comment.id === state.commentAnchor.id);
    setState(state => ({ 
      ...state, 
      selectedComment: commentMatch, 
      selectedCommentBody: commentMatch.description, 
      commentAnchor: null, 
      commentDialogOpen: !state.commentDialogOpen
    }));
  }
  
  const onSubmit = e => {
    const collectionRef = configFirebase(firebase, state.formType, state.selectedResource.id);

    firebase.transaction(t => {
      return t.get(collectionRef).then(doc => {
        const commentsArr = doc.data().comments;
        const filteredCommentsArr = commentsArr.filter(comment => comment.id !== state.selectedComment.id);
        
        const selectedComment = commentsArr.find(comment => comment.id === state.selectedComment.id);
        selectedComment.description = state.selectedCommentBody;
        selectedComment.updatedAt = Date.now();

        filteredCommentsArr.push(selectedComment);
        t.update(collectionRef, { comments: filteredCommentsArr });
    })})
    .then(() => setState(state => ({ 
        ...state, 
        selectedComment: null,
        selectedCommentBody: '', 
        commentDialogOpen: !state.commentDialogOpen 
      })));
    e.preventDefault();
  }

  const onDelete = e => {
    const collectionRef = configFirebase(firebase, state.formType, state.selectedResource.id);

    firebase.transaction(t => {
      return t.get(collectionRef).then(doc => {
        const commentsArr = doc.data().comments;

        const filteredCommentsArr = commentsArr.filter(comment => comment.id !== state.commentAnchor.id);

        t.update(collectionRef, { comments: filteredCommentsArr });
      })})
      .then(() => setState(state => ({ 
        ...state, 
        commentAnchor: null,
        commentConfirmOpen: !state.commentConfirmOpen 
    })));
    e.preventDefault();
  }

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
                {format([comment.createdAt, comment.updatedAt].sort(compareDesc).pop(), 'Pp')}
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

function configFirebase(firebase, formType, resourceId) {
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