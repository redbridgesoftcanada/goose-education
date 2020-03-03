import React, { Fragment } from 'react';
import { Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVertOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import CommentDialog from '../components/CommentDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';

export default function Comments(props) {
  const { i, classes, comment, isCommentOwner, firebase, formType, openPostActions, closePostActions, commentAnchor, commentAnchorOpen, commentDialogOpen, commentConfirmOpen, selectedResource, handleEdit, handleDeleteConfirmation, resetAllActions } = props;

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
    <Fragment key={i}>
      <div className={classes.left}>
        <Typography variant='body2' align='left' color='secondary'>{comment.authorDisplayName}</Typography>
      </div>
      <div className={classes.right}>
        <Typography variant='body2' align='left'>
            {(comment.updatedAt > comment.createdAt) ? format(comment.updatedAt, 'Pp') : format(comment.createdAt, 'Pp')}
        </Typography>
      </div>
      <br/>
      <Grid container spacing={1} justify='space-between'>
        <Grid item xs={11}>
            <Typography component='span' variant='body2' align='left'>{parse(comment.description)}</Typography>
        </Grid>
        
        {/* EDIT & DELETE FEATURE FOR COMMENT OWNER */}
        {isCommentOwner &&
        <>
          <Grid item>
              <IconButton id='comment' onClick={openPostActions}>
                  <MoreVertOutlined/>
              </IconButton>
              <Menu
                  keepMounted
                  anchorEl={commentAnchor}
                  open={commentAnchorOpen}
                  onClose={closePostActions}
              >
                  <MenuItem id='comment' onClick={handleEdit}>Edit comment</MenuItem>
                  <MenuItem id='comment' onClick={handleDeleteConfirmation}>Delete comment</MenuItem>
              </Menu>
          </Grid>

          <CommentDialog formType={formType} firebase={firebase} selectedResource={selectedResource} prevComment={comment} open={commentDialogOpen} onClose={resetAllActions}/>
          <DeleteConfirmation deleteType='comment' open={commentConfirmOpen} handleDelete={() => handleCommentDelete(comment.id)} onClose={handleDeleteConfirmation}/>
        </>
        }
      </Grid>
    </Fragment>
  )
}