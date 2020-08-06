import React, { useEffect, useReducer } from "react";
import { Button, CircularProgress, FormLabel, Input, MenuItem, TextField, makeStyles } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { QuillValidator, SelectValidator } from "../../../constants/customValidators";
import { withFirebase } from "../../firebase";
import { TAGS } from '../../../constants/constants';

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

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case "RESET_STATE":
      const initialState = payload;
      return {...initialState}

    case "EDIT_STATE":
      const { upload, ...prepopulateForm } = payload;
      return {...prepopulateForm, isEdit: true, isLoading: false, upload: ""}
    
    case "INIT_SAVE":
      return {...state, isLoading: true}

    case "TEXT_INPUT": {
      const inputField = payload.name;
      const inputValue = payload.value;
      return {...state, [inputField]: inputValue}
    }
    
    case "RICH_TEXT_INPUT": {
      const inputField = payload.name;
      const inputValue = payload.value;
      return {...state, [inputField]: inputValue}
    }

    case "FILE_UPLOAD":
      const uploadFile = payload;
      if (!uploadFile) {
        return {...state, upload: []}
      }
      return {...state, upload: uploadFile}
    
    default:
      console.log("Not a valid dispatch type for Admin Articles Compose Form.")
  }
}

function UploadAttachmentForm(props) {
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase, formType } = props;

  const INITIAL_STATE = {
    isEdit: false,
    isLoading: false,
    isFeatured: false,
    upload: "",
    title: "",
    description: "",
    tag: "",
    instagramURL: "",
    link1: "",
    link2: ""
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const classes = useStyles();

  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleRichTextInput = (name, value) => dispatch({type: "RICH_TEXT_INPUT", payload: {name, value}});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  const onSubmit = event => {
    dispatch({type: "INIT_SAVE"});
    
    const { isEdit, isLoading, upload, ...newContent } = state;
    // configure Firestore collection/document/storage locations
    let newDoc;
    if (formType === 'announce') {
      newDoc = isEdit ? firebase.announcement(state.id) : firebase.announcements().doc();
    } else if (formType === 'message') {
      newDoc = isEdit ? firebase.message(state.id) : firebase.messages().doc();
    }
    const uploadRef = firebase.attachmentsRef(upload);
    const uploadTask = uploadRef.put(upload);


    // user uploads a file with the form (note. empty array overwrites to a File object)
    uploadTask.on("state_changed", function (snapshot) {
    }, function(error) {
      console.log(error)
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        newDoc.set({
          id: newDoc.id,
          authorDisplayName: "최고관리자",
          authorID: 0,
          comments: [],
          updatedAt: Date.now(),
          attachments: downloadURL,
          ...!isEdit && { 
            createdAt: Date.now(), 
            views: 0 
          },
          ...newContent
        }, { merge: true })
        .then(() => {
          dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
          !isEdit ? setSnackbarMessage("Created successfully!") : setSnackbarMessage("Updated successfully!");
          onDialogClose();
    })});
    event.preventDefault();
    });
  }

  useEffect(() => {
    const prevContent = props.prevContent;
    if (prevContent) {
      dispatch({type:"EDIT_STATE", payload: prevContent});
    } else {
      dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
    }
  }, [dialogOpen]);

  return (
    <ValidatorForm onSubmit={onSubmit}>
      <div>
        <FormLabel component="legend">Title</FormLabel>
        <TextValidator 
          type="text" 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{shrink: true}}
          name="title"
          value={state.title}
          onChange={handleTextInput}
          validators={["required"]}
          errorMessages={[`Cannot submit an empty title.`]}
        />

        <FormLabel component="legend">Tag</FormLabel>
        <SelectValidator
          variant="outlined"
          displayEmpty
          name='tag' 
          defaultValue={state.tag}
          value={state.tag}
          onChange={handleTextInput}
          validators={['required']}
          errorMessages={['Please select a tag.']}>
            <MenuItem value="" disabled>Select One</MenuItem>
            {TAGS.slice(1).map((tag, i) => {
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
          value={state.instagramURL}
          onChange={handleTextInput}/>

        <FormLabel component="legend">Description</FormLabel>
        <QuillValidator
          defaultValue={state.description}
          value={state.description} 
          onChange={value => handleRichTextInput("description", value)}
          validators={["isQuillEmpty"]}
          errorMessages={["Cannot submit an empty post."]}/>

        <FormLabel component="legend">Link #1</FormLabel>
        <TextField 
          type="url" 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{shrink: true}}
          name="link1"
          value={state.link1}
          onChange={handleTextInput}/>

        <FormLabel component="legend">Link #2</FormLabel>
        <TextField 
          type="url" 
          variant="outlined" 
          fullWidth 
          InputLabelProps={{shrink: true}}
          name="link2"
          value={state.link2}
          onChange={handleTextInput}/>

        <FormLabel component="legend">Attachment</FormLabel>
        <Input type="file" disableUnderline onChange={handleFileUpload}/>
      </div>

      <Button type="submit" color="secondary" autoFocus className={classes.button}>
        {state.isLoading ? <CircularProgress /> : "Save"}
      </Button>

    </ValidatorForm>
  );
}

export default withFirebase(UploadAttachmentForm);