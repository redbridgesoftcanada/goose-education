import React, { useEffect, useReducer } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Avatar, Box, Button, CircularProgress, FormHelperText, Grid, makeStyles } from "@material-ui/core";
import { withFirebase } from "../../firebase";
import { SCHOOL_TYPES } from "../../../constants/constants";
import StyledValidators from "../../customMUI";
import { convertToSentenceCase } from '../../../constants/helpers/_features';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  avatar: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },

}));

function SchoolsComposeForm(props) {
  const classes = useStyles();
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase } = props;

  // S T A T E
  const INITIAL_STATE = {
    isEdit: false,
    isLoading: false,
    title: "",
    type: "",
    location: "",
    url: "",
    image: "",
    dateOfEstablishment: "",
    description: "",
    features: "",
    program: "",
    expenses: "",
    numberOfStudents: "",
    openingProcess: "",
    accommodation: "",
    googleUrl: "",
    youtubeUrl: [],
    recommendation: false,
    isFeatured: false,
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
      
      <Box display='flex' justifyContent='center'>
        <Button 
          size='large'
          onClick={onDialogClose} 
          className={classes.button}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          size='large'
          color="secondary" 
          autoFocus 
          className={classes.button}>
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
      const prepopulateForm = payload;
      const { id, createdAt, updatedAt, ...schoolFormFields } = prepopulateForm;
      return {...schoolFormFields, isEdit: true, isLoading: false}
    
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

  const { isEdit, isLoading, ...schoolFormFields } = state;

  return (
    <>
      {Object.entries(schoolFormFields).map(([name, value]) => {
        
        const inputProps = {
          key: name,
          name,
          value,
          label: convertToSentenceCase(name),
          onChange: (value !== 'image') ? handleTextInput : handleFileUpload
        }

        let customComponent;
        switch(name) {
          case 'type':
            customComponent = 
              <StyledValidators.CustomSelect
                {...inputProps}
                label='Institution Type'
                options={SCHOOL_TYPES}
              />
            break;


          case 'recommendation':
          case 'isFeatured': {
            if (name === 'recommendation') {
              inputProps.label = 'Goose Recommended';
              inputProps.helperText = "Display a 'recommended' badge for this institution.";
            } else if (name === 'isFeatured') {
              inputProps.label = 'Featured';
              inputProps.helperText = 'Display this institution on the home page.';
            }

            customComponent = 
              <StyledValidators.CustomRadioGroup
                {...inputProps}
                options={["Yes", "No"]}
              />
            }
            break;

          case 'image': { 
            customComponent = 
              <Grid container>
                {value &&
                  <Grid item xs={12}>
                    <Avatar
                      className={classes.avatar}
                      imgProps={{style: { objectFit: 'contain' }}}
                      alt='School Icon or Logo'
                      variant='rounded' 
                      src={(value.includes('firebase')) ? value : require(`../../../assets/img/${value}`)}/>
                  </Grid>
                }

                <Grid item>
                  <StyledValidators.FileUpload {...inputProps}/>
                </Grid>

              </Grid>
            }
            break;
          
          default: {
            let customHelperText;
            if (name === 'url') {
              inputProps.label = 'Website';
            }

            if (name === 'googleUrl') {
              customHelperText = 'Open Google Maps Address → Share → Embed a map';
              inputProps.label = 'Embedded Google Maps';
            }

            if (name === 'youtubeUrl') {
              customHelperText = 'Open YouTube Video → Share → Embed';
              inputProps.label = 'Embedded YouTube Videos';
            }

            customComponent = 
              <>
                <StyledValidators.TextField {...inputProps} />
                <FormHelperText>{customHelperText}</FormHelperText>
              </>
            }
            break;
        }

        return customComponent;
      })}
    </>
  );
}

export default withFirebase(SchoolsComposeForm);