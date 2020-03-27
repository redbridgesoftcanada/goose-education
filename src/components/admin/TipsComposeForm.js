import React, { useEffect, useReducer } from "react";
import { Button, CircularProgress, FormControlLabel, FormHelperText, FormLabel, RadioGroup, Radio, makeStyles } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { EditorValidator, FileValidator } from "../../constants/customValidators";
import { withFirebase } from "../../components/firebase";

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
      const { image, ...prepopulateForm } = payload;
      return {...prepopulateForm, isEdit: true, isLoading: false, image: ""}
    
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
        return {...state, image: []}
      }
      return {...state, image: uploadFile}
    
    default:
      console.log("Not a valid dispatch type for Tips Compose Form.")
  }
}

function TipsComposeForm(props) {
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase } = props;

  const INITIAL_STATE = {
    isEdit: false,
    isLoading: false,
    isFeatured: false,
    image: "",
    title: "",
    description: ""
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const classes = useStyles();

  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleRichTextInput = (name, value) => dispatch({type: "RICH_TEXT_INPUT", payload: {name, value}});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  const onSubmit = event => {
    dispatch({type: "INIT_SAVE"});
    // configure Firestore collection/document locations
    const { isEdit, isLoading, image, ...newTipsForm } = state;
    const newDoc = isEdit ? firebase.tip(state.id) : firebase.tips().doc();
    // const formContent = {...newTipsForm}
    const uploadRef = firebase.imagesRef(image);
    const uploadTask = uploadRef.put(image);

    // user uploads a file with the form (note. empty array overwrites to a File object)
    uploadTask.on("state_changed", function (snapshot) {
    }, function(error) {
      console.log(error)
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        newDoc.set({
          id: newDoc.id,
          author: "최고관리자",
          ...!isEdit && { createdAt: Date.now(), views: 0 },
          updatedAt: Date.now(),
          image: downloadURL,
          ...newTipsForm
        }, { merge: true })
        .then(() => {
          dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
          !isEdit ? setSnackbarMessage("Created tip successfully!") : setSnackbarMessage("Updated tip successfully!");
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

        <FormLabel component="legend">Description</FormLabel>
        <EditorValidator
          defaultValue={state.description}
          value={state.description} 
          onChange={value => handleRichTextInput("description", value)}
          validators={["isQuillEmpty"]}
          errorMessages={["Cannot submit an empty post."]}/>

        <FormLabel component="legend">Image</FormLabel>
        <FileValidator
          disableUnderline
          onChange={handleFileUpload}
          name="file"
          value={state.image}
          validators={["isRequiredUpload"]}
          errorMessages={["Please upload an image."]} />

        <FormHelperText>Display this institution on the home page.</FormHelperText>
        <RadioGroup name="isFeatured" defaultValue={state.isFeatured} value={state.isFeatured} onChange={handleTextInput}>
          <FormControlLabel value={true} control={<Radio/>} label="Yes" />
          <FormControlLabel value={false} control={<Radio/>} label="No" />
        </RadioGroup>
      </div>

      <Button type="submit" color="secondary" autoFocus className={classes.button}>
        {state.isLoading ? <CircularProgress /> : "Save"}
      </Button>

    </ValidatorForm>
  );
}

export default withFirebase(TipsComposeForm);