import React, { useEffect, useReducer } from 'react';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormHelperText, Grid, Input } from '@material-ui/core';
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
  uploads: ''
}

function ComposeDialogBase(props) {
  const { authUser, firebase, composeOpen, onClose, composeType } = props;
  
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isEdit, isLoading, title, tag, description, instagramURL, link1, link2, uploads } = state;
  
  const configureEditForm = (composeType, isEdit, prevContent) => dispatch({ type:'EDIT_FORM', payload: { composeType, isEdit, prevContent }});
  const handleFormFields = event => dispatch({ payload:event.target });
  const handleRichText = htmlString => dispatch({ type:'RICH_TEXT', payload: htmlString });
  const handleFileUpload = event => dispatch({ type:'FILE_UPLOAD', payload: event.target.files[0] });

  const onSubmit = async event => {
    dispatch({ type: 'INITIALIZE_SAVE' });

    // user uploads a file with the form (note. empty array overwrites to a File object)
    const isFileUploaded = uploads instanceof File;
    
    // configure Firestore collection/document locations
    const metadata = { customMetadata: { "owner": authUser.uid } }
    let uploadKey, formContent, newDoc, prevImage;
    switch (composeType) {
      case "article": {
        const { isEdit, isLoading, uploads, ...articleForm } = state;
        uploadKey = 'image';
        formContent = { ...articleForm, isFeatured: false };
        newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
        prevImage = isEdit && props.article.image;
        break;
      }

      case "announce": {
        const { isEdit, isLoading, uploads, ...announceForm } = state;
        uploadKey = 'attachments';
        formContent = {...announceForm};
        newDoc = isEdit ? firebase.announcement(state.id) : firebase.announcements().doc();
        prevImage = isEdit && props.announcement.attachments;
        break;
      }

      case "message": {
        const { isEdit, isLoading, tag, instagramURL, uploads, ...messageForm } = state;
        uploadKey = 'attachments';
        formContent = {...messageForm}
        newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
        prevImage = isEdit && props.message.attachments;
        break;
      }

      default: 
        console.log('Missing compose type for Compose Dialog onSubmit.');
        return;
    }

    if (isEdit) {
      if (uploads === prevImage) {
        newDoc.set({
          ...formContent,
          updatedAt: Date.now()
        }, { merge: true })
        .then(() => onClose());
      } else if (isFileUploaded) {
        const downloadURL = await handleStorageUpload(uploads, composeType, metadata, firebase);
        newDoc.set({
          ...formContent,
          updatedAt: Date.now(),
          [uploadKey]: downloadURL
        }, { merge: true }).then(async () => {
          prevImage.includes('firebase') && await firebase.refFromUrl(prevImage).delete();
          onClose();
        });
      }

    } else {
      const defaultDocFields = {
        authorID: authUser.uid,
        authorDisplayName: authUser.displayName,
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      if (isFileUploaded) {
        const downloadURL = await handleStorageUpload(uploads, composeType, metadata, firebase);
        newDoc.set({
          ...defaultDocFields,
          ...formContent,
          [uploadKey]: downloadURL
        }).then(() => onClose());
  
      // user does not upload a file with the form
      } else {
        newDoc.set({
          ...defaultDocFields,
          ...formContent,
          [uploadKey]: ''
        }).then(() => onClose());
      }
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

          <Grid container justify='flex-start' alignItems='center'>
            <Grid item xs={2}>
              {uploads ?
                <Avatar
                  style={{width: 144, height: 144}}
                  imgProps={{style: { objectFit: 'contain' }}}
                  alt='G'
                  variant='rounded' 
                  src={
                    uploads instanceof File ? null : uploads.includes('firebase') ? uploads : require(`../assets/img/${uploads}`)}
                  />
              :
                <Box height={144} width={144} border={1} borderColor='grey.500' borderRadius={8}/>
              }
            </Grid>

            {composeType === 'article' ? 
            <Grid item>
              <StyledValidators.FileUpload 
                name='file'
                value={uploads}
                label='Image'
                onChange={handleFileUpload}
                validators={['isRequiredUpload']}
                errorMessages={['']}/>
              {uploads && <FormHelperText>Select a new file to upload and replace current image.</FormHelperText>}
            </Grid>
             :
             <Input type="file" disableUnderline onChange={handleFileUpload}/>
           }
          </Grid>

          <br/>

          <Button 
            type="submit"
            variant="contained" 
            color="secondary" 
            fullWidth>
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

async function handleStorageUpload(uploads, composeType, metadata, firebase) {
  switch (composeType) {
    case "article": {
      const uploadTask = await firebase.imagesRef(uploads).put(uploads, metadata);
      return await retrieveDownloadUrl(uploadTask);
    }
    
    case "announce":
    case "messages": {
      const uploadTask = await firebase.attachmentsRef(uploads).put(uploads, metadata);
      return await retrieveDownloadUrl(uploadTask);
    }

    default: 
      console.log('Missing compose type for Compose Dialog onSubmit.');
      return;
  }
}

function retrieveDownloadUrl(uploadTask) {
  return uploadTask.ref.getDownloadURL().then(downloadURL => {
    return downloadURL;
  });
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case 'EDIT_FORM':
      const { composeType, isEdit, prevContent } = payload;
      if (composeType === 'article') {
        const { image, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, uploads: image, isEdit, isLoading: false }
      
      } else if (composeType === 'message' || composeType === 'announce') {
        const { attachments, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, uploads: attachments, isEdit, isLoading: false }
      }
      break;

    case 'INITIALIZE_SAVE':
      return { ...state, isLoading: true }

    case 'RICH_TEXT':
      return { ...state, description: payload }

    case 'FILE_UPLOAD':
      const uploadFile = payload;
      return (!uploadFile) ? { ...state, uploads: '' } : { ...state, uploads: uploadFile };

    default:
      const inputField = payload.name;
      const inputValue = payload.value;
      return { ...state, [inputField]: inputValue }
  }
}

export default withFirebase(ComposeDialogBase);