import React, { useEffect, useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, Input, MenuItem, TextField } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withAuthorization } from '../components/session';
import { FileValidator, EditorValidator, SelectValidator } from '../components/CustomValidators';

const tags = ['Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

const INITIAL_STATE = {
    isLoading: false,
    title: '',
    description: '',
    tag: '',
    instagramURL: '',
    link1: '',
    link2: '',
    uploads: []
}

function toggleReducer(state, action) {
    const { type, payload } = action;
    
    switch(type) {
        case 'INITIALIZE_SAVE':
          return { ...state, isLoading: true }

        case 'SUCCESS_SAVE':
          return { ...INITIAL_STATE }

        case 'RICH_TEXT':
          return { ...state, description: payload }

        case 'FILE_UPLOAD':
          const uploadFile = payload;
          if (!uploadFile) {
            return { ...state, uploads: [] }
          }
          return { ...state, uploads: uploadFile }

        default:
          const inputField = payload.name;
          const inputValue = payload.value;
          return { ...state, [inputField]: inputValue }
    }
}

function ComposeDialogBase(props) {
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isLoading, title, tag, description, instagramURL, link1, link2, uploads } = state;
  const { authUser, firebase, history, composeOpen, onClose, composeType } = props;

  const onSubmit = event => {
    dispatch({type: 'INITIALIZE_SAVE'});

    let uploadKey, formContent, newDoc, uploadRef;
    if (composeType === '/networking') {
      const { isLoading, uploads, ...articleForm } = state;
      uploadKey = 'image';
      formContent = {...articleForm};
      newDoc = firebase.articles().doc();
    } else if (composeType === '/services') {
      const { isLoading, tag, instagramURL, uploads, ...messageForm } = state;
      uploadKey = 'attachments';
      formContent = {...messageForm};
      newDoc = firebase.messages().doc();
    }

    // if user uploads a file with the form
    if (uploads.length) { 
      if (composeType === '/networking') {
        uploadRef = firebase.images(uploads);
      } else if (composeType === '/services') {
        uploadRef = firebase.attachments(uploads);
      }

      uploadRef.on('state_changed', () => {
        uploadRef.snapshot.ref.getDownloadURL().then(downloadURL => {
          newDoc.set({
            id: newDoc.id,
            authorID: authUser.uid,
            authorDisplayName: authUser.displayName,
            comments: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            views: 0,
            [uploadKey]: downloadURL, 
            ...formContent
          }).then(() => {
            dispatch({type: 'SUCCESS_SAVE'});
            onClose();
            history.push(composeType)})
          // .catch(error => dispatch({ type: 'error', payload: error }))
      })})
      
    } else {
      newDoc.set({
        id: newDoc.id,
        authorID: authUser.uid,
        authorDisplayName: authUser.displayName,
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        views: 0,
        [uploadKey]: uploads, 
        ...formContent
      }).then(() => {
        dispatch({type: 'SUCCESS_SAVE'});
        onClose();
        history.push(composeType)})
      // .catch(error => dispatch({ type: 'error', payload: error }));
    }
    event.preventDefault();
  }

  useEffect(() => {
    ValidatorForm.addValidationRule('isNotHTML', value => {
      if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
          return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule('isRequiredUpload', value => {
      if (value.length === 0) {
          return false;
      }
      return true;
    });
  });
  
  return (
    <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='md'>
      <DialogTitle>{ composeType === '/networking' ? 'Create Post' : 'Create Counselling Request' }</DialogTitle>
      <DialogContent>
        <ValidatorForm onSubmit={onSubmit}>
          <FormLabel component="legend">Title</FormLabel>
          <TextValidator 
            type="text" 
            variant="outlined" 
            fullWidth 
            InputLabelProps={{shrink: true}}
            name="title"
            value={title}
            onChange={event => dispatch({ payload: event.target })}
            validators={['required']}
            errorMessages={['Cannot submit an empty title.']}/>

          {composeType === '/networking' &&
            <>
              <FormLabel component="legend">Tag</FormLabel>
              <SelectValidator 
                variant="outlined"
                displayEmpty
                name='tag' 
                value={tag} 
                onChange={event => dispatch({ payload: event.target })}
                validators={['required']}
                errorMessages={['Please select a tag.']}>
                  <MenuItem value="" disabled>Select One</MenuItem>
                  {tags.map((tag, i) => {
                      return <MenuItem key={i} name={tag} value={tag}>{tag}</MenuItem>
                  })}
              </SelectValidator>

              <FormLabel component="legend">Instagram</FormLabel>
              <TextField 
                type="url"
                variant="outlined" 
                fullWidth 
                InputLabelProps={{shrink: true}}
                name="instagramURL"
                value={instagramURL}
                onChange={event => dispatch({ payload: event.target })}
                placeholder="https://www.instagram.com/gooseedu/"/>
            </>
          }

          <EditorValidator 
            value={description} 
            onChange={value => dispatch({ type: 'RICH_TEXT', payload: value })}
            validators={['isNotHTML']}
            errorMessages={['Cannot submit an empty post.']}/>

          <FormLabel component="legend">Link #1</FormLabel>
          <TextField 
          type="url" 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{shrink: true}}
          name="link1"
          value={link1}
          onChange={event => dispatch({ payload: event.target })}/>

          <FormLabel component="legend">Link #2</FormLabel>
          <TextField 
          type="url" 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{shrink: true}}
          name="link2"
          value={link2}
          onChange={event => dispatch({ payload: event.target })}/>

          <FormLabel component="legend">Uploads</FormLabel>
          {composeType === '/networking' ?
            <FileValidator
              disableUnderline
              onChange={event => dispatch({ type: 'FILE_UPLOAD', payload: event.target.files[0] })}
              value={uploads}
              validators={['isRequiredUpload', 'allowedExtensions: image/jpeg, image/png']}
              errorMessages={['Please upload an image.', 'Only JPEG or PNG files supported.']} />
            :
            <Input type="file" disableUnderline onChange={event => dispatch({ type: 'FILE_UPLOAD', payload: event.target.files[0] })}/>
          }

          <Button variant="contained" color="secondary" fullWidth type="submit">
          { isLoading ? <CircularProgress /> : 'Submit' }
          </Button>
        </ValidatorForm>
      </DialogContent>
    </Dialog>
  )
}

// const composeDialog = withStyles(styles)(ComposeDialogBase);
const composeDialog = ComposeDialogBase;
const condition = authUser => !!authUser;

export default withAuthorization(condition)(composeDialog);