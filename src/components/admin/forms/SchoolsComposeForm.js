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
    marginTop: theme.spacing(2)
  },

}));

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

function SchoolsComposeForm(props) {
  const classes = useStyles();
  const { firebase, dialogOpen, onDialogClose, setSnackbarMessage } = props;

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { isEdit, isLoading, ...schoolFormFields } = state;

  const onChange = event => dispatch({type:"TEXT_INPUT", payload:event.target});
  const onUpload = event => dispatch({type:"FILE_UPLOAD", payload:event.target.files[0]});
  
  const onSubmit = event => {
    
    dispatch({type: "INIT_SAVE"});

    // configure Firestore collection/document locations
    const { image, ...newSchoolForm } = schoolFormFields;
    const docRef = isEdit ? firebase.school(state.id) : firebase.schools().doc();
    const uploadRef = firebase.imagesRef(image);
    const uploadTask = uploadRef.put(image);

    // user uploads a file with the form (note. empty string overwrites to a File object)
    uploadTask.on("state_changed", function(snapshot) {
    }, function(error) {
      console.log('Error in upload task: ', error)
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        docRef.set({
          ...!isEdit && { id: docRef.id, createdAt: Date.now() },
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
      dispatch({ type:"EDIT_STATE", payload: prevContent });
    } else {
      dispatch({ type:"RESET_STATE" });
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
      
      {generateFormContent(classes, schoolFormFields, onChange, onUpload)}
      
      <Box display='flex' justifyContent='center'>
        <Button className={classes.button}
          size='large'
          onClick={onDialogClose}>
          Cancel
        </Button>

        <Button className={classes.button}
          type="submit" 
          size='large'
          color="secondary" 
          autoFocus>
          {state.isLoading ? <CircularProgress /> : "Save"}
        </Button>
      </Box>

    </ValidatorForm>
  );
}

function generateFormContent(classes, formFields, onChange, onUpload) {
  return (
    <>
      {Object.entries(formFields).map(([name, value]) => {
        const defaultProps = {
          key: name,
          name,
          value,
          label: convertToSentenceCase(name),
          onChange: (name !== 'image') ? onChange : onUpload
        }

        let customComponent;
        switch(name) {
          case 'type':
            customComponent = 
              <StyledValidators.CustomSelect
                {...defaultProps}
                options={SCHOOL_TYPES}
                label='Institution Type'
                validators={['isSelected']}
                errorMessages={['']}
              />
            break;

          case 'recommendation':
          case 'isFeatured': {
            if (name === 'recommendation') {
              defaultProps.label = 'Goose Recommended';
              defaultProps.helperText = "Display a 'recommended' badge for this institution.";
            } else if (name === 'isFeatured') {
              defaultProps.label = 'Featured';
              defaultProps.helperText = 'Display this institution on the home page.';
            }

            customComponent = 
              <StyledValidators.CustomRadioGroup
                {...defaultProps}
                options={["Yes", "No"]}
                validators={['isSelected']}
                errorMessages={['']}
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
                      alt='S'
                      variant='rounded' 
                      src={
                        value instanceof File ? null : value.includes('firebase') ? value : require(`../../../assets/img/${value}`)}/>
                  </Grid>
                }

                <Grid item>
                  <StyledValidators.FileUpload 
                    {...defaultProps}
                    validators={['isRequiredUpload']}
                    errorMessages={['']}/>
                </Grid>

              </Grid>
            }
            break;
          
          case 'url':
          case 'googleUrl':
          case 'youtubeUrl': 

            let customHelperText;
            if (name === 'url') {
              defaultProps.label = 'Website';

            } else if (name === 'googleUrl') {
              customHelperText = 'Open Google Maps Address → Share → Embed a map';
              defaultProps.label = 'Embedded Google Maps';

            } else if (name === 'youtubeUrl') {
              customHelperText = 'Open YouTube Video → Share → Embed';
              defaultProps.label = 'Embedded YouTube Videos';
            }

            customComponent = 
              <>
                <StyledValidators.TextField {...defaultProps} />
                <FormHelperText>{customHelperText}</FormHelperText>
              </>
            break;

          case 'title':
          case 'description': 
            defaultProps.validators = ['required', 'isQuillEmpty'];
            defaultProps.errorMessages = ['', ''];  
            customComponent = <StyledValidators.TextField {...defaultProps} />
            break;
          
          default:
            customComponent = <StyledValidators.TextField {...defaultProps} />
        }

        return customComponent;
      })}
    </>
  );
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case "RESET_STATE":
      return { ...INITIAL_STATE }

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

    case "FILE_UPLOAD":
      const uploadFile = payload;
      return (!uploadFile) ? { ...state, image: [] } : { ...state, image: uploadFile }
    
    default:
      console.log("Not a valid dispatch type for SchoolsComposeForm.")
  }
}

export default withFirebase(SchoolsComposeForm);