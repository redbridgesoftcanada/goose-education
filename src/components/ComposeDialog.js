import React, { useEffect, useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, Input, MenuItem, TextField, Select } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FileValidator, EditorValidator, SelectValidator } from '../constants/customValidators';
import { withAuthorization } from '../components/session';

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

  const handleFormFields = event => dispatch({ payload:event.target });
  const handleRichText = value => dispatch({ type:'RICH_TEXT', payload:value });
  const handleFileUpload = event => dispatch({ type:'FILE_UPLOAD', payload:event.target.files[0] });

  const onSubmit = event => {
    dispatch({type: 'INITIALIZE_SAVE'});
    let uploadKey, formContent, newDoc, uploadRef;
    if (composeType.includes('/networking')) {
      const { isLoading, uploads, ...articleForm } = state;
      uploadKey = 'image';
      formContent = {...articleForm};
      newDoc = firebase.articles().doc();
    } else if (composeType.includes('/services')) {
      const { isLoading, tag, instagramURL, uploads, ...messageForm } = state;
      uploadKey = 'attachments';
      formContent = {...messageForm};
      newDoc = firebase.messages().doc();
    }

    // if user uploads a file with the form (note. empty array overwrites to a File object)
    if (!uploads || uploads.length !== 0) { 
      if (composeType.includes('/networking')) {
        uploadRef = firebase.images(uploads);
      } else if (composeType.includes('/services')) {
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
          }, { merge: true }).then(() => {
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
      }, { merge: true }).then(() => {
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
      <DialogTitle>{ composeType.includes('/networking') ? 'Create Post' : 'Create Counselling Request' }</DialogTitle>
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
            onChange={handleFormFields}
            validators={['required']}
            errorMessages={['Cannot submit an empty title.']}/>

          {composeType.includes('/networking') &&
            <>
              <FormLabel component="legend">Tag</FormLabel>
              <SelectValidator
                variant="outlined"
                displayEmpty
                name='tag' 
                defaultValue={tag}
                value={tag}
                onChange={handleFormFields}
                validators={['required']}
                errorMessages={['Please select a tag.']}>
                  {/* <InputLabel>Select One</InputLabel> */}
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
                onChange={handleFormFields}
                placeholder="https://www.instagram.com/gooseedu/"/>
            </>
          }

          <EditorValidator 
            value={description} 
            onChange={handleRichText}
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
          onChange={handleFormFields}/>

          <FormLabel component="legend">Link #2</FormLabel>
          <TextField 
          type="url" 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{shrink: true}}
          name="link2"
          value={link2}
          onChange={handleFormFields}/>

          <FormLabel component="legend">Uploads</FormLabel>
          {composeType.includes('/networking') ?
            <FileValidator
              disableUnderline
              onChange={handleFileUpload}
              name="file"
              value={uploads}
              validators={['isRequiredUpload']}
              errorMessages={['Please upload an image.']} />
            :
            <Input type="file" disableUnderline onChange={handleFileUpload}/>
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