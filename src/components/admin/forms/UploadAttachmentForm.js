import React, { useEffect, useReducer } from "react";
import { Box, Button, CircularProgress, makeStyles, FormHelperText } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { withFirebase } from "../../firebase";
import { TAGS } from '../../../constants/constants';
import StyledValidators  from '../../customMUI';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const INITIAL_STATE = {
  isEdit: false,
  isLoading: false,
  isFeatured: false,
  attachments: "",
  title: "",
  description: "",
  tag: "",
  instagramURL: "",
  link1: "",
  link2: ""
}

function UploadAttachmentForm(props) {
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase, formType } = props;

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isEdit, isLoading, ...uploadForm } = state;
  const classes = useStyles();

  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleRichTextInput = htmlString => dispatch({type: "RICH_TEXT_INPUT", payload: htmlString});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  const onSubmit = async event => {
    const cleanupActions = message => {
      dispatch({type:"RESET_STATE"});
      setSnackbarMessage(message);
      onDialogClose();
    }
    const { attachments, ...newForm } = uploadForm;
    
    // config Firebase collection reference and document content;
    let docRef;
    if (formType === 'announce') {
      docRef = isEdit ? firebase.announcement(state.id) : firebase.announcements().doc();
    } else if (formType === 'message') {
      docRef = isEdit ? firebase.message(state.id) : firebase.messages().doc();
    }
    
    dispatch({type: "INIT_SAVE"});
    if (isEdit) {
      const prevAttachment = props.prevContent.attachments;
      if (!attachments || attachments === prevAttachment) {
        docRef.set({ 
          ...newForm, 
          updatedAt: Date.now() 
        }, { merge: true })
        .then(() => cleanupActions(`Updated ${formType} - please refresh to see new changes`));

      } else if (attachments instanceof File) {
        // if user uploads a new File, delete previous upload from Storage;
        if (prevAttachment) await firebase.refFromUrl(prevAttachment).delete();
        
        const uploadTask = firebase.attachmentsRef(attachments).put(attachments);
        const downloadURL = await uploadStorageAttachment(uploadTask);
        docRef.set({
          ...newForm,
          updatedAt: Date.now(),
          attachments: downloadURL
        }, { merge: true })
        .then(async () => {
          prevAttachment.includes('firebase') && await firebase.refFromUrl(prevAttachment).delete();
          cleanupActions(`Updated ${formType} - please refresh to see new changes!`);
        });
      }

    } else {
      if (!attachments) {
        docRef.set({
          ...newForm,
          id: docRef.id,
          authorDisplayName: firebase.getCurrentUser().displayName,
          authorID: firebase.getCurrentUser().uid,
          comments: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          attachments: "",
        })
        .then(() => cleanupActions(`Created ${formType} - please refresh to see new changes`));

      } else { 
        const uploadTask = firebase.attachmentsRef(attachments).put(attachments);
        const downloadURL = await uploadStorageAttachment(uploadTask);
        docRef.set({
          ...newForm,
          id: docRef.id,
          authorDisplayName: firebase.getCurrentUser().displayName,
          authorID: firebase.getCurrentUser().uid,
          comments: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          attachments: downloadURL,
        })
        .then(() => cleanupActions(`Created ${formType} - please refresh to see new changes`));
      }
    }
    event.preventDefault();
  }

  useEffect(() => {
    const prevContent = props.prevContent;
    if (prevContent) {
      dispatch({type:"EDIT_STATE", payload: prevContent});
    } else {
      dispatch({type:"RESET_STATE"});
    }
  }, [dialogOpen]);

  useEffect(() => {
    ValidatorForm.addValidationRule('isSelected', value => !!value);
    // (optional cleanup mechanism for effects) - remove rule when not needed;
    return () => ValidatorForm.removeValidationRule('isSelected');
  });

  return (
    <ValidatorForm onSubmit={onSubmit}>
      <StyledValidators.TextField 
        name="title"
        value={state.title}
        label="Title"
        onChange={handleTextInput}
        validators={["required", "isQuillEmpty"]}
        errorMessages={[""]}/>

      <StyledValidators.CustomSelect
        name="tag"
        value={state.tag}
        label="Tag"
        onChange={handleTextInput}
        options={TAGS.slice(1)}
        validators={['isSelected']}
        errorMessages={['']}/>

      <StyledValidators.TextField
        name="instagramURL"
        value={state.instagramURL}
        label="Instagram"
        onChange={handleTextInput}/>

      <StyledValidators.RichTextField
        name="description"
        value={state.description}
        label="Description"
        onChange={handleRichTextInput}/>
      
      <StyledValidators.TextField
        name="link1"
        value={state.link1}
        label="Link #1"
        onChange={handleTextInput}/>
      
      <StyledValidators.TextField
        name="link2"
        value={state.link2}
        label="Link #2"
        onChange={handleTextInput}/>

      <StyledValidators.FileUpload 
        label='Attachment'
        onChange={handleFileUpload}/>
      
      {(isEdit && state.attachments) &&
        <FormHelperText>Attachment Found: if applicable, select to upload and replace existing file.</FormHelperText>
      }

      <Box display='flex' justifyContent='center'>
        <Button className={classes.button} onClick={onDialogClose}>
          Cancel
        </Button>

        <Button type="submit" color="secondary" autoFocus className={classes.button}>
          {state.isLoading ? <CircularProgress /> : "Save"}
        </Button>
      </Box>

    </ValidatorForm>
  );
}

function uploadStorageAttachment(uploadTask) {
  return uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
    return downloadURL;
  });
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case "RESET_STATE":
      return {...INITIAL_STATE}

    case "EDIT_STATE":
      return {...payload, isEdit: true, isLoading: false}
    
    case "INIT_SAVE":
      return {...state, isLoading: true}

    case "TEXT_INPUT": {
      const inputField = payload.name;
      const inputValue = payload.value;
      return {...state, [inputField]: inputValue}
    }
    
    case "RICH_TEXT_INPUT": {
      return {...state, description: payload}
    }

    case "FILE_UPLOAD":
      const uploadFile = payload;
      if (!uploadFile) {
        return {...state, attachments: []}
      }
      return {...state, attachments: uploadFile}
    
    default:
      console.log("Not a valid dispatch type for Admin Articles Compose Form.")
  }
}

export default withFirebase(UploadAttachmentForm);