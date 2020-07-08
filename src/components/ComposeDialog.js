import React, { useEffect, useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, Input } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { TAGS } from '../constants/constants';
import { textField, textValidator, richTextValidator, fileValidator, selectValidator } from '../constants/helpers-admin';
import { withAuthorization } from '../components/session';

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case 'EDIT_FORM':
      const { composeType, isEdit, prevContent } = payload;
      if (composeType === 'article') {
        const { image, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, isEdit, isLoading: false, uploads: [] }
      
      } else if (composeType === 'message' || composeType === 'announce') {
        const { attachments, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, isEdit, isLoading: false, uploads: [] }
      }

    case 'INITIALIZE_SAVE':
      return { ...state, isLoading: true }

    case 'RICH_TEXT':
      return { ...state, description: payload }

    case 'FILE_UPLOAD':
      const uploadFile = payload;
      return (!uploadFile) ? { ...state, uploads: [] } : { ...state, uploads: uploadFile };

    default:
      const inputField = payload.name;
      const inputValue = payload.value;
      return { ...state, [inputField]: inputValue }
  }
}

function ComposeDialogBase(props) {
  const INITIAL_STATE = {
    isEdit: false,
    isLoading: false,
    title: '',
    description: '',
    tag: '',
    instagramURL: '',
    link1: '',
    link2: '',
    uploads: []
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isEdit, isLoading, title, tag, description, instagramURL, link1, link2, uploads } = state;
  const { authUser, firebase, history, composeOpen, onClose, composeType } = props;
  
  const configureEditForm = (composeType, isEdit, prevContent) => dispatch({ type:'EDIT_FORM', payload: { composeType, isEdit, prevContent }});
  const handleFormFields = event => dispatch({ payload:event.target });
  const handleRichText = (name, value) => dispatch({ type:'RICH_TEXT', payload:value });
  const handleFileUpload = event => dispatch({ type:'FILE_UPLOAD', payload:event.target.files[0] });

  const onSubmit = event => {
    dispatch({ type: 'INITIALIZE_SAVE' });

    // configure Firestore collection/document locations
    let uploadKey, uploadRef, newDoc, formContent, redirectPath;
    switch (composeType) {
      case "article": {
        const { isEdit, isLoading, uploads, ...articleForm } = state;
        uploadKey = 'image';
        uploadRef = firebase.imagesRef(uploads);
        newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
        formContent = {...articleForm};
        redirectPath = {
          pathname: '/networking', 
          state: { title: 'Networking', selected: 0 }
        }
        break;
      }

      case "message": {
        const { isEdit, isLoading, tag, instagramURL, uploads, ...messageForm } = state;
        uploadKey = 'attachments';
        uploadRef = firebase.attachmentsRef(uploads);
        newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
        formContent = {...messageForm}
        redirectPath = {
          pathname: '/services',
          state: { title: 'Service Centre', tab: 1 }
        }
        break;
      }

      case "announce": {
        const { isEdit, isLoading, uploads, ...announceForm } = state;
        uploadKey = 'attachments';
        uploadRef = firebase.attachmentsRef(uploads);
        newDoc = isEdit ? firebase.announcement(state.id) : firebase.announcements().doc();
        formContent = {...announceForm};
        redirectPath = {
          pathname: '/services', 
          state: { title: 'Service Centre', tab: 0 }
        }
      }
    }

    const defaultDocFields = {
      authorID: authUser.uid,
      authorDisplayName: authUser.roles['admin'] ? '슈퍼관리자' : authUser.displayName,
      comments: [],
      ...!isEdit && { createdAt: Date.now() },
      updatedAt: Date.now(),
      views: 0
    }

    // user uploads a file with the form (note. empty array overwrites to a File object)
    if (uploads.length !== 0) {
      const metadata = { customMetadata: { "owner": authUser.uid } }
      const uploadTask = uploadRef.put(uploads, metadata);

      uploadTask.on('state_changed', function(snapshot) {
      }, function(error) { dispatch({ type: 'error', payload: error.code });
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL()
        .then(function(downloadURL) {
          newDoc.set({
            ...defaultDocFields,
            ...formContent,
            [uploadKey]: downloadURL
          }, { merge: true })
        .then(() => {
          onClose();
          history.push(redirectPath)});
        })});

    // user does not upload a file with the form
    } else {
      newDoc.set({
        ...defaultDocFields,
        ...formContent,
        [uploadKey]: uploads
      }, { merge: true })
      .then(() => {
        onClose();
        history.push(redirectPath)});
    }
    event.preventDefault();
  }

  useEffect(() => {
    const { composeType, isEdit } = props;
    const prevContent = props.article;
    prevContent && configureEditForm(composeType, isEdit, prevContent);
  }, [props.article]);
  
  return (
    <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='md'>
      <DialogTitle>{generateDialogTitle(isEdit, composeType)}</DialogTitle>
      <DialogContent>
        <ValidatorForm onSubmit={onSubmit}>
          <FormLabel component="legend">Title</FormLabel>
          {textValidator("title", title, handleFormFields)}

          {(composeType === 'article' || composeType === 'announce') &&
            <>
              <FormLabel component="legend">Tag</FormLabel>
              {selectValidator("tag", tag, TAGS.slice(1), handleFormFields)}
            </>
          }

          {composeType === 'article' &&
            <>
              <FormLabel component="legend">Instagram</FormLabel>
              {textValidator("instagramURL", instagramURL, handleFormFields)}
            </>
          }

          {richTextValidator("description", description, handleRichText)}

          <FormLabel component="legend">Link #1</FormLabel>
          {textField("link1", link1, handleFormFields, false)}

          <FormLabel component="legend">Link #2</FormLabel>
          {textField("link2", link2, handleFormFields, false)}

          <FormLabel component="legend">Uploads</FormLabel>
          {composeType === 'article' ?
            fileValidator("file", uploads, handleFileUpload) : <Input type="file" disableUnderline onChange={handleFileUpload}/>
          }

          <Button variant="contained" color="secondary" fullWidth type="submit">
          {isLoading ? <CircularProgress /> : 'Submit'}
          </Button>
        </ValidatorForm>
      </DialogContent>
    </Dialog>
  )
}

function generateDialogTitle(isEdit, composeType) {
  switch(isEdit) {
    case false: {
      switch (composeType) {
        case "article": return "Create Post";
        case "message": return "Create Counselling Request";
        case "announce": return "Create Announcement";
      }
    }
    break;
    
    case true: {
      switch (composeType) {
        case "article": return "Edit Post";
        case "message": return "Edit Counselling Request";
        case "announce": return "Edit Announcement";
      }
    }
    break;
  }
}

// const composeDialog = withStyles(styles)(ComposeDialogBase);
const composeDialog = ComposeDialogBase;
const condition = authUser => !!authUser;

export default withAuthorization(condition)(composeDialog);