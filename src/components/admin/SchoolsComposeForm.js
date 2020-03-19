import React, { useEffect, useReducer } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Button, CircularProgress, FormLabel, FormControlLabel, FormHelperText, MenuItem, OutlinedInput, Paper, RadioGroup, Radio, Stepper, Step, StepLabel, StepContent, makeStyles } from "@material-ui/core";
import { FileValidator, EditorValidator, SelectValidator } from "../../constants/customValidators";
import { SCHOOL_TYPES } from "../../constants/constants";
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
      return {...prepopulateForm, activeStep: 0, isEdit: true, isLoading: false, image: ""}
    
    case "INIT_SAVE":
      return {...state, isLoading: true}

    case "PREVIOUS_STEP": {
      const prevActiveStep = state.activeStep;
      return {...state, activeStep: prevActiveStep - 1}
    }

    case "NEXT_STEP": {
      const prevActiveStep = state.activeStep;
      return {...state, activeStep: prevActiveStep + 1}
    }

    case "RESET_STEP": 
      return {...state, activeStep: 0}

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

function getStepContent(step, state, dispatch) {

  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleRichTextInput = (name, value) => dispatch({type: "RICH_TEXT_INPUT", payload: {name, value}});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  // Form Input Field Components
  const validateRichTextField = (name, value) => {
    return (
      <EditorValidator 
        defaultValue={value}
        value={value} 
        onChange={value => handleRichTextInput(name, value)}
        validators={["isQuillEmpty"]}
        errorMessages={["Cannot submit an empty post."]}/>
    )
  }

  const validateTextField = (type, name, value) => {
    return (
      <TextValidator 
        type={type} 
        variant="outlined" 
        fullWidth 
        InputLabelProps={{shrink: true}}
        name={name}
        value={value}
        onChange={handleTextInput}
        validators={["required"]}
        errorMessages={[`Cannot submit an empty ${name}.`]}
      />
    )
  }

  const noValidateTextField = (type, name, value) => {
    return (
      <OutlinedInput
        type={type}
        // fullWidth 
        name={name}
        value={value}
        onChange={handleTextInput}
      />
    )
  }

  const noValidateRadioField = (description, name, value) => {
    return (
      <>
        <FormHelperText>{description}</FormHelperText>
        <RadioGroup name={name} value={value} onChange={handleTextInput}>
          <FormControlLabel value="true" control={<Radio/>} label="Yes" />
          <FormControlLabel value="false" control={<Radio/>} label="No" />
        </RadioGroup>
      </>
    );
  }

  switch (step) {
    case 0:
      return (
        <>
          <FormLabel component="legend">Title</FormLabel>
          {validateTextField("text", "title", state.title)}

          <FormLabel component="legend">Institution Type</FormLabel>
          <SelectValidator
            variant="outlined"
            displayEmpty
            name="type" 
            defaultValue={state.type}
            value={state.type}
            onChange={handleTextInput}
            validators={["required"]}
            errorMessages={["Please select a type."]}>
              <MenuItem value="" disabled>Select One</MenuItem>
              {SCHOOL_TYPES.map((type, i) => {
                  return <MenuItem key={i} name={type} value={type}>{type}</MenuItem>
              })}
          </SelectValidator>

          <FormLabel component="legend">Date of Establishment</FormLabel>
          {noValidateTextField("text", "dateOfEstablishment", state.dateOfEstablishment)}

          <FormLabel component="legend">Location</FormLabel>
          {noValidateTextField("text", "location", state.location)}
          
          <FormLabel component="legend">Institution Website</FormLabel>
          {noValidateTextField("url", "url", state.url)}

          <FormLabel component="legend">Image</FormLabel>
          <FileValidator
            disableUnderline
            onChange={handleFileUpload}
            name="file"
            value={state.image}
            validators={["isRequiredUpload"]}
            errorMessages={["Please upload an image."]} />
          
          <FormLabel component="legend">Goose Recommended</FormLabel>
          {noValidateRadioField("Display a 'recommended' badge for this institution.", "isRecommended", state.isRecommended)}

          <FormLabel component="legend">Featured</FormLabel>
          {noValidateRadioField("Display this institution on the home page.", "isFeatured", state.isFeatured)}
        </>
      );

    case 1:
      return (
        <>
          <FormLabel component="legend">Introduction</FormLabel>
          {validateRichTextField("description", state.description)}

          <FormLabel component="legend">Features</FormLabel>
          {validateRichTextField("features", state.features)}

          <FormLabel component="legend">Programs</FormLabel>
          {validateRichTextField("program", state.program)}

          <FormLabel component="legend">Expenses</FormLabel>
          {validateRichTextField("expenses", state.expenses)}

          <FormLabel component="legend">Number of Students</FormLabel>
          {noValidateTextField("number", "numberOfStudents", state.numberOfStudents)}

          <FormLabel component="legend">Opening Process</FormLabel>
          {validateRichTextField("openingProcess", state.openingProcess)}

          <FormLabel component="legend">Accommodations</FormLabel>
          {validateRichTextField("accommodation", state.accommodation)}
        </>
      );

    case 2:
      return (
        <>
          <FormLabel component="legend">Embedded Google Maps</FormLabel>
          {noValidateTextField("url", "googleUrl", state.googleUrl)}

          <FormLabel component="legend">YouTube</FormLabel>
          {noValidateTextField("url", "youtubeUrl", state.youtubeUrl)}
        </>
      );

    default:
      return "Unknown step";
  }
}

function SchoolsComposeForm(props) {
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase } = props;

  const INITIAL_STATE = {
    activeStep: 0,
    isEdit: false,
    isLoading: false,
    image: "",
    title: "",
    type: "",
    location: "",
    url: "",
    dateOfEstablishment: "",
    isRecommended: false,
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
  console.log('state ', state)
  const classes = useStyles();

  const steps = ["General", "School Information", "School Guide"];
  const handleNext = () => dispatch({type: "NEXT_STEP"});
  const handleBack = () => dispatch({type: "PREVIOUS_STEP"});
  const handleReset = () => dispatch({type: "RESET_STEP"});

  const onSubmit = event => {
    dispatch({type: "INIT_SAVE"});
    
    // configure Firestore collection/document locations
    const { activeStep, isEdit, isLoading, image, ...newSchoolForm } = state;
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
      <Stepper activeStep={state.activeStep} orientation="vertical">
        {steps.map((label, i) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
                {getStepContent(i, state, dispatch)}
                <div className={classes.actionsContainer}>
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="contained" color="primary" className={classes.button}>
                    {state.activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {state.activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Button onClick={handleBack} className={classes.button}>
            Back
          </Button>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
          <Button type="submit" color="secondary" autoFocus className={classes.button}>
            {state.isLoading ? <CircularProgress /> : "Save"}
          </Button>
        </Paper>
      )}
    </ValidatorForm>
  );
}

export default withFirebase(SchoolsComposeForm);