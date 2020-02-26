import React, { useEffect, useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, Input, MenuItem, TextField } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FileValidator, EditorValidator, SelectValidator } from '../constants/customValidators';
import { withAuthorization } from '../components/session';

const tags = ['Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case 'EDIT_FORM':
      const { composeType, isEdit, prevContent } = payload;
      if (composeType === 'article') {
        const { image, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, isEdit, isLoading: false, uploads: [] }
      
      } else if (composeType === 'message') {
        const { attachments, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, isEdit, isLoading: false, uploads: [] }
      }

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
  const { authUser, firebase, history, composeOpen, onClose, composeType } = props;

  const configureEditForm = (composeType, isEdit, prevContent) => dispatch({ type:'EDIT_FORM', payload: { composeType, isEdit, prevContent }});
  const handleFormFields = event => dispatch({ payload:event.target });
  const handleRichText = value => dispatch({ type:'RICH_TEXT', payload:value });
  const handleFileUpload = event => dispatch({ type:'FILE_UPLOAD', payload:event.target.files[0] });

  const onSubmit = event => {
    dispatch({ type: 'INITIALIZE_SAVE' });

    // configure Firestore collection/document locations
    let uploadKey, uploadRef, uploadTask, newDoc, formContent, redirectPath;
    if (composeType === 'article') {
      const { isEdit, isLoading, uploads, ...articleForm } = state;
      uploadKey = 'image';
      newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
      formContent = {...articleForm};
      redirectPath = {
        pathname: '/networking', 
        state: {
          title: 'Networking', 
          selected: 0
        }
      }

    } else if (composeType === 'message') {
      const { isEdit, isLoading, tag, instagramURL, uploads, ...messageForm } = state;
      uploadKey = 'attachments';
      newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
      formContent = {...messageForm}
      redirectPath = {
        pathname: '/services',
        state: {
          title: 'Service Centre',
          selected: 0
        }
      }
    }
    // user uploads a file with the form (note. empty array overwrites to a File object)
    if (uploads.length !== 0) {

      uploadRef = (composeType === 'article') ? firebase.imagesRef(uploads) : firebase.attachmentsRef(uploads);
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
            ...isEdit && { createdAt: Date.now() },
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
        ...isEdit && { createdAt: Date.now() },
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
    const { composeType, isEdit } = props;
    const prevContent = props.article;
    prevContent && configureEditForm(composeType, isEdit, prevContent);

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
        {composeType === 'article' ? 
          !isEdit ? 'Create Post' : 'Edit Post'
        : 
        composeType === 'message' ? 
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

          {composeType === 'article' &&
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
          {composeType === 'article' ?
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