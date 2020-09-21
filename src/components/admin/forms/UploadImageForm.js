import React, { useEffect, useReducer } from "react";
import { Avatar, Box, Button, CircularProgress, Grid, makeStyles } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { withFirebase } from "../../firebase";
import { TAGS } from "../../../constants/constants";
import StyledValidators from "../../customMUI";

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
  upload: "",
  title: "",
  description: "",
  tag: "",
  instagramURL: "",
  link1: "",
  link2: ""
}

function UploadImageForm(props) {
  const classes = useStyles();
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase, formType } = props;

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  // D I S P A T C H  M E T H O D S
  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleRichTextInput = htmlString => dispatch({type: "RICH_TEXT_INPUT", payload: htmlString});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  const onSubmit = event => {
    dispatch({type: "INIT_SAVE"});
    
    const { isEdit, isLoading, upload, ...newContent } = state;
    // configure Firestore collection/document/storage locations
    let newDoc, formContent;
    if (formType === 'article') {
      newDoc = isEdit ? firebase.article(state.id) : firebase.articles().doc();
      formContent = {...newContent}
    } else if (formType === 'tip') {
      const { tag, instagramUrl, link1, link2, ...newTipsForm} = newContent;
      newDoc = isEdit ? firebase.tip(state.id) : firebase.tips().doc();
      formContent = {...newTipsForm}
    }
    const uploadRef = firebase.imagesRef(upload);
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
          image: downloadURL,
          ...!isEdit && { createdAt: Date.now() },
          ...formContent
        }, { merge: true })
        .then(() => {
          dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
          !isEdit ? 
            setSnackbarMessage(`Created ${formType} - please refresh to see new changes.`) : 
            setSnackbarMessage(`Updated ${formType} - please refresh to see new changes`);
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

  return (
    <ValidatorForm onSubmit={onSubmit}>
      <StyledValidators.TextField
        name="title"
        value={state.title}
        label="Title"
        onChange={handleTextInput}
        validators={['required', 'isQuillEmpty']}
        errorMessages={['']}/>

      {formType === "article" &&
        <>
          <StyledValidators.CustomSelect
            name="tag"
            value={state.tag}
            label="Tag"
            onChange={handleTextInput}
            options={TAGS.slice(1)}
            validators={['isSelected']}
            errorMessages={['']}
          />

          <StyledValidators.TextField
            name="instagramURL"
            value={state.instagramURL}
            label="Instagram"
            onChange={handleTextInput}/>
        </>
      }

      <br/>
      <StyledValidators.RichTextField
        name="description"
        value={state.description}
        label="Description"
        onChange={handleRichTextInput}/>

      {formType === "article" && 
        <>
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
        </>
      }

      <StyledValidators.FileUpload 
        value={state.upload}
        label='Image'
        onChange={handleFileUpload}
        validators={['isRequiredUpload']}
        errorMessages={['']}/>

      <StyledValidators.CustomRadioGroup
        name='isFeatured'
        value={state.isFeatured}
        label='Goose Featured'
        onChange={handleTextInput}
        helperText={`Display as a featured ${formType} on the home page.`}
        options={["Yes", "No"]}
        validators={['isSelected']}
        errorMessages={['']}
      />

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
      return {...state, description: payload}
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

export default withFirebase(UploadImageForm);