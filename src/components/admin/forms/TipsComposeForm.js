import React, { useEffect, useReducer } from "react";
import { Button, CircularProgress, DialogContent, FormControlLabel, FormHelperText, FormLabel, RadioGroup, Radio, Typography, makeStyles } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { withFirebase } from "../../firebase";
import * as COMPONENTS from "../../../constants/helpers-admin";

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
  image: {
    display: 'block',
    border: '0',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  },
  mt2: {
    marginTop: theme.spacing(2),
  },
}));

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case "RESET_STATE":
      const initialState = payload;
      return {...initialState}

    case "EDIT_STATE":
      const prepopulateForm = payload;
      return {...prepopulateForm, isEdit: true, isLoading: false}
    
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
  const classes = useStyles();
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase } = props;

  // S T A T E
  const INITIAL_STATE = {
    isEdit: false,
    isLoading: false,
    isFeatured: false,
    image: "",
    title: "",
    description: ""
  }
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  useEffect(() => {
    const prevContent = props.prevContent;
    if (prevContent) {
      dispatch({type:"EDIT_STATE", payload: prevContent});
    } else {
      dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
    }
  }, [dialogOpen]);

  // D I S P A T C H  M E T H O D S
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
          comments: [],
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

  return (
    <ValidatorForm onSubmit={onSubmit}>
      <FormLabel>Title</FormLabel>
      {COMPONENTS.textValidator("title", state.title, handleTextInput)}

      {(state.image) &&
        <>
          <FormLabel>Current Image</FormLabel>
          <img className={classes.image} src={(state.image.includes('firebase')) ? state.image : require(`../../../assets/img/${state.image}`)} alt="cover image"/>
        </>
      }
        
      <div className={classes.mt2}>
        <FormLabel>Upload Image</FormLabel>
        <div>
          {COMPONENTS.fileValidator("file", state.image, handleFileUpload)}
        </div>
      </div>

      <div className={classes.mt2}>
        <FormLabel>Description</FormLabel>
        {COMPONENTS.richTextValidator("description", state.description, handleRichTextInput)}
      </div>
      {/* </DialogContent> */}

      <div className={classes.mt2}>
      <FormLabel>Featured Tip</FormLabel>
      <FormHelperText>This will display this tip on the Goose Home Page.</FormHelperText>
      <RadioGroup name="isFeatured" defaultValue={state.isFeatured} value={state.isFeatured} onChange={handleTextInput}>
        <FormControlLabel value={true} control={<Radio/>} label="Yes" />
        <FormControlLabel value={false} control={<Radio/>} label="No" />
      </RadioGroup>
      </div>

      {/* <div> */}
        <Button className={classes.button} onClick={onDialogClose}>
          Cancel
        </Button>

        <Button type="submit" color="secondary" autoFocus className={classes.button}>
          {state.isLoading ? <CircularProgress /> : "Save"}
        </Button>
      {/* </div> */}

    </ValidatorForm>
  );
}

export default withFirebase(TipsComposeForm);