import React, { useContext, useEffect, useReducer } from 'react';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, Input } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { TAGS } from '../constants/constants';
import { AuthUserContext } from '../components/session';
import { DatabaseContext } from '../components/database';
import { DispatchContext } from '../components/userActions';
import StyledValidators from '../components/customMUI';
import { withFirebase } from '../components/firebase';

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case 'prepopulateForm':
      const { composeType, isEdit, prevContent } = payload;
      if (composeType === 'article') {
        const { image, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, uploads: image, isEdit, isLoading: false }
      
      } else if (composeType === 'messages' || composeType === 'announces') {
        const { attachments, ...prepopulateForm } = prevContent;
        return { ...prepopulateForm, uploads: attachments, isEdit, isLoading: false }
      }
      break;

    case 'isLoading':
      return { ...state, isLoading: true }

    case 'richText':
      return { ...state, description: payload }

    case 'fileUpload':
      const uploadFile = payload;
      return (!uploadFile) ? { ...state, uploads: '' } : { ...state, uploads: uploadFile };

    // other form field types and values;
    default:
      const inputField = payload.name;
      const inputValue = payload.value;
      return { ...state, [inputField]: inputValue }
  }
}

function ComposeDialog(props) {
  const authUser = useContext(AuthUserContext);
  const { setNotification } = useContext(DispatchContext);
  const { triggerFetch } = useContext(DatabaseContext);
  const { firebase, composeOpen, onClose, composeType } = props;

  const [ state, dispatch ] = useReducer(toggleReducer, {
    isEdit: false,
    isLoading: false,
    title: '',
    description: '',
    tag: '',
    instagramURL: '',
    link1: '',
    link2: '',
    uploads: ''
  });
  const { isEdit, isLoading, title, description, tag, instagramURL, link1, link2, uploads } = state;
  
  const configureEditForm = (composeType, isEdit, prevContent) => dispatch({ type:'prepopulateForm', payload: { composeType, isEdit, prevContent }});
  const handleRichText = htmlString => dispatch({ type:'richText', payload: htmlString });
  const handleFileUpload = event => dispatch({ type:'fileUpload', payload: event.target.files[0] });
  const handleFormFields = event => dispatch({ payload:event.target });
  const onSubmit = async event => {
    dispatch({ type: 'isLoading' });

    // user uploads a file with the form (note. empty array overwrites to a File object)
    const isFileUploaded = uploads instanceof File;
    
    // configure Firestore collection/document locations
    const metadata = { customMetadata: { "owner": authUser.uid } }
    let uploadKey, formContent, newDoc, prevUpload;
    switch (composeType) {
      case "article": {
        const { isEdit, isLoading, uploads, ...articleForm } = state;
        uploadKey = 'image';
        formContent = { ...articleForm, isFeatured: false };
        newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
        prevUpload = isEdit && props.article.image;
        break;
      }

      case "announces": {
        const { isEdit, isLoading, uploads, ...announceForm } = state;
        uploadKey = 'attachments';
        formContent = {...announceForm};
        newDoc = isEdit ? firebase.announcement(state.id) : firebase.announcements().doc();
        prevUpload = isEdit && props.article.attachments;
        break;
      }

      case "messages": {
        const { isEdit, isLoading, tag, instagramURL, uploads, ...messageForm } = state;
        uploadKey = 'attachments';
        formContent = {...messageForm}
        newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
        prevUpload = isEdit && props.article.attachments;
        break;
      }

      default: 
        console.log('Missing compose type for Compose Dialog onSubmit.');
        return;
    }

    if (isEdit) {
      // user does not change/upload a file with the form;
      if (uploads === prevUpload) {
        newDoc.set({
          ...formContent,
          updatedAt: Date.now()
        }, { merge: true })
        .then(() => {
          onClose();
          setNotification({ action: 'success', message: 'Changes have been saved.' });
        });
        
      } else if (isFileUploaded) {
        const downloadURL = await handleStorageUpload(uploads, composeType, metadata, firebase);
        newDoc.set({
          ...formContent,
          updatedAt: Date.now(),
          [uploadKey]: downloadURL
        }, { merge: true })
        .then(async () => {
          prevUpload && prevUpload.includes('firebase') && await firebase.refFromUrl(prevUpload).delete();
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
        })
        .then(() => {
          triggerFetch(composeType);
          onClose();
          setNotification({ action: 'success', message: `Successfully created!` });
        })
  
      // user does not upload a file with the form;
      } else {
        newDoc.set({
          ...defaultDocFields,
          ...formContent,
          [uploadKey]: ''
        })
        .then(() => {
          triggerFetch(composeType);
          onClose();
          setNotification({ action: 'success', message: `Successfully created!` });
        })
      }
    }
    event.preventDefault();
  }

  // prepopulate form fields for editing;
  useEffect(() => {
    const { composeType, isEdit } = props;
    const prevContent = props.article;
    prevContent && configureEditForm(composeType, isEdit, prevContent);
  }, [props]);

  // custom validation rules for <ValidatorForm/> fields;
  useEffect(() => {
    ValidatorForm.addValidationRule('isSelected', value => !!value);
    return () => ValidatorForm.removeValidationRule('isSelected');  // remove rule when not needed (optional cleanup mechanism for effects);
  });

  useEffect(() => {
    ValidatorForm.addValidationRule("isRequiredUpload", value => {
      if (!value || value.length === 0) return false;
      return true;
    });
    return () => ValidatorForm.removeValidationRule('isRequiredUpload');
  });
  
  return (
    <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='md'>
      <ValidatorForm onSubmit={onSubmit}>
        <DialogTitle>{generateDialogTitle(isEdit, composeType)}</DialogTitle>
        <DialogContent>
        
            <StyledValidators.TextField
              name='title'
              value={title}
              label='Title'
              onChange={handleFormFields}
              validators={['required', 'isQuillEmpty']}
              errorMessages={['', '']}
            />

            {(composeType === 'article' || composeType === 'announces') &&
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

            {composeType === 'announces' ? null 
              :
              <Grid container justify='flex-start' alignItems='center' style={{marginTop: 25}}>
                <Grid item xs={2}>
                  {uploads ? 
                    composeType === "article" ?
                      <Avatar
                        style={{width: 130, height: 130}}
                        imgProps={{style: { objectFit: 'contain' }}}
                        alt='G'
                        variant='rounded' 
                        src={uploads instanceof File ? null : uploads}/>
                    :
                      <Avatar style={{width: 130, height: 130}} variant='rounded'>
                        <DescriptionIcon style={{fontSize: 50}}/>
                      </Avatar>
                    :
                      <Box height={130} width={130} border={1} borderColor='grey.500' borderRadius={8}/>
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
            }
        </DialogContent>
        <DialogActions>
          <Button 
            type="submit"
            variant="contained" 
            color="secondary" 
            fullWidth
            >
            {isLoading ? <CircularProgress /> : 'Submit'}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}

function generateDialogTitle(isEdit, composeType) {
  if (isEdit) {
    switch (composeType) {
      case "article": return "Edit Post";
      case "messages": return "Edit Counselling Request";
      case "announces": return "Edit Announcement";
      default: return;
    }
  } else {
    switch (composeType) {
      case "article": return "Create Post";
      case "messages": return "Create Counselling Request";
      case "announces": return "Create Announcement";
      default: return;
    }
  }
}

async function handleStorageUpload(uploads, composeType, metadata, firebase) {
  switch (composeType) {
    case "article": {
      const uploadTask = await firebase.imagesRef(uploads).put(uploads, metadata);
      return await retrieveDownloadUrl(uploadTask);
    }
    
    case "announces":
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

export default withFirebase(ComposeDialog);