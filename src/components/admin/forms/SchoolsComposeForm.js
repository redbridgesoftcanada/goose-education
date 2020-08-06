import React, { useEffect, useReducer } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Button, CircularProgress, DialogContentText, Divider, FormHelperText, FormLabel, Grid, Input, makeStyles } from "@material-ui/core";
import { withFirebase } from "../../firebase";
import * as COMPONENTS from "../../../constants/helpers-admin";
import { SCHOOL_TYPES } from "../../../constants/constants";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
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
      console.log("Not a valid dispatch type for SchoolsComposeForm.")
  }
}

function generateFormContent(classes, state, dispatch) {

  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  return (
    <>
      <DialogContentText variant="subtitle1">General Information</DialogContentText>

      <FormLabel component="legend">Title</FormLabel>
      {COMPONENTS.textField("title", state.title, handleTextInput, false)}

      <FormLabel component="legend">Institution Type</FormLabel>
      {COMPONENTS.configRadioGroup("type", state.type, SCHOOL_TYPES, handleTextInput, "")}

      <FormLabel component="legend">Date of Establishment</FormLabel>
      {COMPONENTS.textField("dateOfEstablishment", state.dateOfEstablishment, handleTextInput, false)}

      <FormLabel component="legend">Location</FormLabel>
      {COMPONENTS.textField("location", state.location, handleTextInput, false)}
      
      <FormLabel component="legend">Institution Website</FormLabel>
      {COMPONENTS.textField("url", state.url, handleTextInput, false)}

      <FormLabel component="legend">Image</FormLabel>
      {state.image &&
        <img alt={`${state.title} logo`} src={(state.image.includes('firebase')) ? state.image : require(`../../../assets/img/${state.image}`)} className={classes.large} />
      }
      <div>
        <Input type="file" disableUnderline onChange={handleFileUpload}/>
      </div>
      
      <Grid container>
        <Grid item xs={3}>
          <FormLabel component="legend">Goose Recommended</FormLabel>
          {COMPONENTS.configRadioGroup("recommendation", state.recommendation, [{value: true, label:"Yes"}, {value: false, label:"No"}], handleTextInput, "Display a 'recommended' badge for this institution.")}
        </Grid>
        <Grid item xs={3}>
          <FormLabel component="legend">Featured</FormLabel>
          {COMPONENTS.configRadioGroup("isFeatured", state.isFeatured, [{value: true, label:"Yes"}, {value: false, label:"No"}], handleTextInput, "Display this institution on the home page.")}
        </Grid>
      </Grid>
      
      <Divider variant="middle" className={classes.divider}/>

      <DialogContentText variant="subtitle1">School Information</DialogContentText>
      
      <FormLabel component="legend">Introduction</FormLabel>
      {COMPONENTS.textField("description", state.description, handleTextInput, true)}

      <FormLabel component="legend">Features</FormLabel>
      {COMPONENTS.textField("features", state.features, handleTextInput, true)}

      <FormLabel component="legend">Programs</FormLabel>
      {COMPONENTS.textField("program", state.program, handleTextInput, true)}

      <FormLabel component="legend">Expenses</FormLabel>
      {COMPONENTS.textField("expenses", state.expenses, handleTextInput, true)}

      <FormLabel component="legend">Number of Students</FormLabel>
      {COMPONENTS.textField("numberOfStudents", state.numberOfStudents, handleTextInput, false)}

      <Divider variant="middle" className={classes.divider}/>

      <DialogContentText variant="subtitle1">School Guide</DialogContentText>

      <FormLabel component="legend">Opening Process</FormLabel>
      {COMPONENTS.textField("openingProcess", state.openingProcess, handleTextInput, true)}

      <FormLabel component="legend">Accommodations</FormLabel>
      {COMPONENTS.textField("accommodation", state.accommodation, handleTextInput, true)}

      <FormLabel component="legend">Embedded Google Maps</FormLabel>
      <FormHelperText>Open Google Maps Address → Share → Embed a map</FormHelperText>
      {COMPONENTS.textField("googleUrl", state.googleUrl, handleTextInput, false)}

      <FormLabel component="legend">Embedded YouTube</FormLabel>
      <FormHelperText>Open YouTube Video → Share → Embed</FormHelperText>
      {COMPONENTS.textField("youtubeUrl", state.youtubeUrl, handleTextInput, false)}
    </>
  );
}

function SchoolsComposeForm(props) {
  const classes = useStyles();
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase } = props;

  // S T A T E
  const INITIAL_STATE = {
    isEdit: false,
    isLoading: false,
    image: "",
    title: "",
    type: "",
    location: "",
    url: "",
    dateOfEstablishment: "",
    recommendation: false,
    isFeatured: false,
    description: "",
    features: "",
    program: "",
    expenses: "",
    numberOfStudents: "",
    openingProcess: "",
    accommodation: "",
    googleUrl: "",
    youtubeUrl: [],
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
  const onSubmit = event => {
    dispatch({type: "INIT_SAVE"});
    
    // configure Firestore collection/document locations
    const { isEdit, isLoading, image, ...newSchoolForm } = state;
    const newDoc = isEdit ? firebase.school(state.id) : firebase.schools().doc();
    // const formContent = {...newSchoolForm}
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
          ...!isEdit && { createdAt: Date.now() },
          updatedAt: Date.now(),
          image: downloadURL,
          ...newSchoolForm
        }, { merge: true })
        .then(() => {
          dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
          !isEdit ? setSnackbarMessage("Created school successfully!") : setSnackbarMessage("Updated school successfully!");
          onDialogClose();
    })});
    event.preventDefault();
    });
  }

  return (
    <ValidatorForm onSubmit={onSubmit}>
      {generateFormContent(classes, state, dispatch)}
      <div>
        <Button onClick={onDialogClose} className={classes.button}>
          Cancel
        </Button>
        <Button type="submit" color="secondary" autoFocus className={classes.button}>
          {state.isLoading ? <CircularProgress /> : "Save"}
        </Button>
      </div>
    </ValidatorForm>
  );
}

export default withFirebase(SchoolsComposeForm);