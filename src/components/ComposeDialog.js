import React, { useEffect, useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Input } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { TAGS } from '../constants/constants';
import StyledValidators from '../components/customMUI';
import { withFirebase } from '../components/firebase';

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

function ComposeDialogBase(props) {
  const { authUser, firebase, composeOpen, onClose, composeType } = props;
  
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isEdit, isLoading, title, tag, description, instagramURL, link1, link2, uploads } = state;
  
  const configureEditForm = (composeType, isEdit, prevContent) => dispatch({ type:'EDIT_FORM', payload: { composeType, isEdit, prevContent }});
  const handleFormFields = event => dispatch({ payload:event.target });
  const handleRichText = htmlString => dispatch({ type:'RICH_TEXT', payload: htmlString });
  const handleFileUpload = event => dispatch({ type:'FILE_UPLOAD', payload: event.target.files[0] });

  const onSubmit = event => {
    dispatch({ type: 'INITIALIZE_SAVE' });

    // user uploads a file with the form (note. empty array overwrites to a File object)
    const isFileUploaded = uploads instanceof File;

    // configure Firestore collection/document locations
    let uploadKey, uploadRef, newDoc, formContent;
    switch (composeType) {
      case "article": {
        const { isEdit, isLoading, uploads, ...articleForm } = state;
        uploadKey = 'image';
        uploadRef = isFileUploaded && firebase.imagesRef(uploads);
        newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
        formContent = { ...articleForm, isFeatured: false };
        break;
      }

      case "announce": {
        const { isEdit, isLoading, uploads, ...announceForm } = state;
        uploadKey = 'attachments';
        uploadRef = isFileUploaded && firebase.attachmentsRef(uploads);
        newDoc = isEdit ? firebase.announcement(state.id) : firebase.announcements().doc();
        formContent = {...announceForm};
        break;
      }

      case "message": {
        const { isEdit, isLoading, tag, instagramURL, uploads, ...messageForm } = state;
        uploadKey = 'attachments';
        uploadRef = isFileUploaded && firebase.attachmentsRef(uploads);
        newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
        formContent = {...messageForm}
        break;
      }

      default: 
        console.log('Missing compose type for Compose Dialog onSubmit.');
        return;
    }

    const defaultDocFields = {
      authorID: authUser.uid,
      authorDisplayName: authUser.displayName,
      comments: [],
      ...!isEdit && { createdAt: Date.now() },
      updatedAt: Date.now()
    }

    if (isFileUploaded) {
      const metadata = { customMetadata: { "owner": authUser.uid } }
      const uploadTask = uploadRef.put(uploads, metadata);

      uploadTask.on('state_changed', snapshot => {
      },

      error => { 
        dispatch({ type: 'error', payload: error.code });
      }, 

      () => {
        uploadTask.snapshot.ref.getDownloadURL()
          .then(function(downloadURL) {
            newDoc.set({
              ...defaultDocFields,
              ...formContent,
              [uploadKey]: downloadURL
            }, { merge: true })
          .then(() => {
            onClose();
          });
        })});

    // user does not upload a file with the form
    } else {
      newDoc.set({
        ...defaultDocFields,
        ...formContent,
        [uploadKey]: []
      })
      .then(() => {
        onClose();
        // history.push(redirectPath)
      });
    }
    event.preventDefault();
  }

  useEffect(() => {
    ValidatorForm.addValidationRule('isSelected', value => !!value);
    // (optional cleanup mechanism for effects) - remove rule when not needed;
    return () => ValidatorForm.removeValidationRule('isSelected');
  });


  useEffect(() => {
    ValidatorForm.addValidationRule("isRequiredUpload", value => {
      if (!value || value.length === 0) return false;
      return true;
    });
    return () => ValidatorForm.removeValidationRule('isRequiredUpload');
  });

  useEffect(() => {
    const { composeType, isEdit } = props;
    const prevContent = props.article;
    prevContent && configureEditForm(composeType, isEdit, prevContent);
  }, [props]);
  
  return (
    <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='md'>
      <DialogTitle>{generateDialogTitle(isEdit, composeType)}</DialogTitle>
      <DialogContent>
        <ValidatorForm onSubmit={onSubmit}>
      
          <StyledValidators.TextField
            name='title'
            value={title}
            label='Title'
            onChange={handleFormFields}
            validators={['required', 'isQuillEmpty']}
            errorMessages={['', '']}
          />

          {(composeType === 'article' || composeType === 'announce') &&
            <StyledValidators.CustomSelect
              name='tag'
              value={tag}
              options={TAGS.slice(1)}
              label='Category'
              onChange={handleFormFields}
              validators={['isSelected']}
              errorMessages={['']}
            />
          }

          {composeType === 'article' &&
            <StyledValidators.TextField
              name='instagramURL'
              value={instagramURL}
              label='Instagram'
              onChange={handleFormFields}
            />
          }

          <br/>
          <StyledValidators.RichTextField
            name='description'
            value={description}
            defaultValue={description}
            onChange={handleRichText}
          />

          <StyledValidators.TextField
            name='link1'
            value={link1}
            label='Link #1'
            onChange={handleFormFields}
          />

          <StyledValidators.TextField
            name='link2'
            value={link2}
            label='Link #2'
            onChange={handleFormFields}
          />

          <br/>
          {composeType === 'article' ? 
            <StyledValidators.FileUpload
              name='file'
              value={uploads}
              label='Image'
              onChange={handleFileUpload}
              validators={['isRequiredUpload', 'allowedExtensions:image/png,image/jpeg,image/jpg']}
              errorMessages={['', '']}
            />
            :
            <Input type="file" disableUnderline onChange={handleFileUpload}/>
          }

          <br/><br/>
          <Button 
            type="submit"
            variant="contained" 
            color="secondary" 
            fullWidth >
            {isLoading ? <CircularProgress /> : 'Submit'}
          </Button>

        </ValidatorForm>
      </DialogContent>
    </Dialog>
  )
}

function generateDialogTitle(isEdit, composeType) {
  switch(isEdit) {
    case false:
      switch (composeType) {
        case "article": return "Create Post";
        case "message": return "Create Counselling Request";
        case "announce": return "Create Announcement";
        default: return;
      }
    
    case true:
      switch (composeType) {
        case "article": return "Edit Post";
        case "message": return "Edit Counselling Request";
        case "announce": return "Edit Announcement";
        default: return;
    }

    default:
      return;
  }
}

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
      break;

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

export default withFirebase(ComposeDialogBase);