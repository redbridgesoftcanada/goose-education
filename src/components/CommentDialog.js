import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { EditorValidator } from '../constants/customValidators';

export default function CommentDialog(props) {
  const { firebase, selectedResource, prevComment, open, onClose } = props;

  const [comment, setComment] = useState(prevComment.description);
  
  const onSubmit = event => {
    const announcementsRef = firebase.announcement(selectedResource.id);

    firebase.transaction(t => {
      return t.get(announcementsRef).then(doc => {
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
        t.update(announcementsRef, { comments: filteredCommentsArr });
    })})
    .then(() => { 
        setComment('');
        onClose();
    });
    // .catch(error => dispatch({ type: 'error', payload: error }))
    event.preventDefault();
  }

  useEffect(() => {
    ValidatorForm.addValidationRule('isQuillEmpty', value => {
      if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        return false;
      }
      return true;
    });
  }, []);

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