import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { EditorValidator } from '../constants/customValidators';

export default function CommentDialog(props) {
  const { formType, firebase, selectedResource, prevComment, open, onClose } = props;

  const [comment, setComment] = useState(prevComment.description);
  
  const onSubmit = event => {

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
          return comment.id !== prevComment.id
        });

        let selectedComment = commentsArr.find(comment => {
          return comment.id === prevComment.id
        });

        selectedComment.description = comment;
        selectedComment.updatedAt = Date.now();

        filteredCommentsArr.push(selectedComment);
        t.update(collectionRef, { comments: filteredCommentsArr });
    })})
    .then(() => { 
        setComment('');
        onClose();
    });
    // .catch(error => dispatch({ type: 'error', payload: error }))
    event.preventDefault();
  }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogContent>
              <ValidatorForm noValidate autoComplete='off' onSubmit={onSubmit}>
                <EditorValidator 
                defaultValue={comment}
                value={comment} 
                onChange={setComment}
                validators={['isQuillEmpty']}
                errorMessages={['Cannot submit an empty comment.']}/>
              </ValidatorForm>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button onClick={onSubmit} color="secondary">SAVE</Button>
            </DialogActions>
        </Dialog>
    );
}