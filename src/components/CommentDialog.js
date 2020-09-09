import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withFirebase } from '../components/firebase';
import StyledValidators from '../components/customMUI';

function CommentDialog(props) {
  const { formType, firebase, selectedResource, prevComment, onClose } = props;

  const [ comment, setComment ] = useState(prevComment.description);
  
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
      default:
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
      <ValidatorForm onSubmit={onSubmit}>
        <StyledValidators.TextField
          value={comment}
          onChange={event => setComment(event.currentTarget.value)}
          validators={['isQuillEmpty']}
          errorMessages={['']}/>
        <Button onClick={onClose}>CANCEL</Button>
        <Button onClick={onSubmit} color="secondary">SAVE</Button>
      </ValidatorForm>
    );
}

export default withFirebase(CommentDialog);