import React, { useEffect, useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, Input, MenuItem, TextField, Select } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FileValidator, EditorValidator, SelectValidator } from '../constants/customValidators';
import { withAuthorization } from '../components/session';

const tags = ['Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

function toggleReducer(state, action) {
    const { type, payload } = action;
    
    switch(type) {
      case 'EDIT_FORM':
        const { image, ...prevContent } = payload.prevContent;
        return { ...prevContent, isEdit: payload.isEdit, isLoading: false }

      case 'INITIALIZE_SAVE':
        return { ...state, isLoading: true }

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
  const { authUser, firebase, history, composeOpen, onClose, composePath } = props;

  const configureEditForm = (isEdit, prevContent) => dispatch({ type:'EDIT_FORM', payload: { isEdit, prevContent }});
  const handleFormFields = event => dispatch({ payload:event.target });
  const handleRichText = value => dispatch({ type:'RICH_TEXT', payload:value });
  const handleFileUpload = event => dispatch({ type:'FILE_UPLOAD', payload:event.target.files[0] });

  const onSubmit = event => {
    dispatch({ type: 'INITIALIZE_SAVE' });
    // configure Firestore collection/document locations
    let uploadKey, uploadRef, uploadTask, newDoc, formContent, redirectPath;
    if (composePath.includes('/networking')) {
      const { isEdit, isLoading, uploads, ...articleForm } = state;
      uploadKey = 'image';
      uploadRef = (!uploads || uploads.length !== 0) && firebase.imagesRef(uploads);
      newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
      formContent = {...articleForm};
      redirectPath = '/networking';

    } else if (composePath.includes('/services')) {
      const { isEdit, isLoading, tag, instagramURL, uploads, ...messageForm } = state;
      uploadKey = 'attachments';
      uploadRef = (!uploads || uploads.length !== 0) && firebase.attachmentsRef(uploads);
      newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
      formContent = {...messageForm};
      redirectPath = '/services';
    }
    
    // user uploads a file with the form (note. empty array overwrites to a File object)
    if (uploadRef) {
      uploadTask = uploadRef.put(uploads);

      uploadTask.on('state_changed', function (snapshot) {
      }, function(error) {
        console.log(error)
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          newDoc.set({
            id: newDoc.id,
            authorID: authUser.uid,
            authorDisplayName: authUser.displayName,
            comments: [],
            ...isEdit ? {} : { createdAt: Date.now() },
            updatedAt: Date.now(),
            views: 0,
            [uploadKey]: downloadURL, 
            ...formContent
          }, { merge: true }).then(() => {
            onClose();
            history.push(redirectPath)});
          // .catch(error => dispatch({ type: 'error', payload: error }))
      })});

    // user does not upload a file with the form
    } else {
      newDoc.set({
        id: newDoc.id,
        authorID: authUser.uid,
        authorDisplayName: authUser.displayName,
        comments: [],
        ...isEdit ? {} : { createdAt: Date.now() },
        updatedAt: Date.now(),
        views: 0,
        [uploadKey]: uploads, 
        ...formContent
      }, { merge: true }).then(() => {
        onClose();
        history.push(redirectPath)});
      // .catch(error => dispatch({ type: 'error', payload: error }));
    }
    event.preventDefault();
  }

  useEffect(() => {
    const isEdit = props.isEdit;
    const prevContent = props.article;
    prevContent && configureEditForm(isEdit, prevContent);

    ValidatorForm.addValidationRule('isQuillEmpty', value => {
      if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule('isRequiredUpload', value => {
      if (!value || value.length === 0) {
        return false;
      }
      return true;
    });
  }, [props.article]);
  
  return (
    <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='md'>
      <DialogTitle>
        {composePath.includes('/networking') ? 
          !isEdit ? 'Create Post' : 'Edit Post'
        : 
        composePath.includes('/services') ? 
          !isEdit ? 'Create Counselling Request' : 'Edit Counselling Request'
        :
        ''
        }
      </DialogTitle>
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

          {composePath.includes('/networking') &&
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
                onChange={handleFormFields}/>
            </>
          }

          <EditorValidator 
            defaultValue={description}
            value={description} 
            onChange={handleRichText}
            validators={['isQuillEmpty']}
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
          {composePath.includes('/networking') ?
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