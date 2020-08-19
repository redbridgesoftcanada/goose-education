import React from 'react';
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
  const { comment, isCommentOwner, firebase, formType, openPostActions, closePostActions, commentAnchor, commentAnchorOpen, commentDialogOpen, commentConfirmOpen, selectedResource, handleEdit, handleDeleteConfirmation, resetAllActions } = props;

  const handleCommentDelete = id => {
    let collectionRef;
    switch(formType) {
      case 'announcement':
        collectionRef = firebase.announcement(selectedResource.id);
        break;
        
      case 'message':
        collectionRef = firebase.message(selectedResource.id);
        break;

      case 'article':
        collectionRef = firebase.article(selectedResource.id);
        break;

      default:
    }

    firebase.transaction(t => {
      return t.get(collectionRef).then(doc => {
          const commentsArr = doc.data().comments;

          const filteredCommentsArr = commentsArr.filter(comment => {
          return comment.id !== id
          });

          t.update(collectionRef, { comments: filteredCommentsArr });
      })})
      .then(() => resetAllActions());
  }

  return (
    <>
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
          <Typography className={classes.commentText}>{parse(comment.description)}</Typography>
        </Grid>

        <Grid container item xs={1} className={classes.feContainer}>
          <IconButton id='comment' onClick={openPostActions}>
            <MoreVertOutlined fontSize='small'/>
          </IconButton>
        </Grid>
      </Grid>

      {/* Conditional Components - Edit + Delete Features */}
      {isCommentOwner &&
        <>
          <Menu
              keepMounted
              anchorEl={commentAnchor}
              open={commentAnchorOpen}
              onClose={closePostActions}>
              <MenuItem id='comment' onClick={handleEdit}>Edit Comment</MenuItem>
              <MenuItem id='comment' onClick={handleDeleteConfirmation}>Delete Comment</MenuItem>
          </Menu>

          <CommentDialog 
            formType={formType}
            firebase={firebase} 
            selectedResource={selectedResource} 
            prevComment={comment} 
            open={commentDialogOpen} 
            onClose={resetAllActions}/>
              
          <DeleteConfirmation 
            deleteType='comment' 
            open={commentConfirmOpen} 
            handleDelete={() => handleCommentDelete(comment.id)} 
            onClose={handleDeleteConfirmation}/>
        </>
      }
    </>
  )
}

export default withFirebase(Comments);