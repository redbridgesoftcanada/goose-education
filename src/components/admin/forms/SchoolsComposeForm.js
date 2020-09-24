import React, { Fragment, useEffect, useReducer } from "react";
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
    height: theme.spacing(18)
  },

}));

const INITIAL_STATE = {
  isEdit: false,
  isLoading: false,
  image: "",
  title: "",
  type: "",
  location: "",
  url: "",
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
  const onUpload = event => dispatch({type:"FILE_UPLOAD", payload:event.target.files});
  
  const onSubmit = async event => {
    
    dispatch({type: "INIT_SAVE"});
    const { image, ...newSchoolForm } = schoolFormFields;
    const cleanupActions = message => {
      dispatch({type:"RESET_STATE"});
      setSnackbarMessage(message);
      onDialogClose();
    }

    if (isEdit) {
      const prevImage = props.prevContent.image;
      const docRef = firebase.school(props.prevContent.id);
      if (image === prevImage) {
        docRef.set({
          ...newSchoolForm,
          updatedAt: Date.now()
        }, { merge: true })
        .then(() => cleanupActions("Updated school successfully!"));
        event.preventDefault();

      } else if (image instanceof File) {
        const uploadTask = firebase.imagesRef(image).put(image);
        const downloadURL = await uploadStorageImage(uploadTask);
        docRef.set({
          ...newSchoolForm,
          updatedAt: Date.now(),
          image: downloadURL
        }, { merge: true })
        .then(() => cleanupActions("Updated school successfully!"));
        event.preventDefault();
      }

    } else {
      const docRef = firebase.schools().doc();
      const uploadTask = firebase.imagesRef(image).put(image);
      const downloadURL = await uploadStorageImage(uploadTask);

      docRef.set({
        ...newSchoolForm,
        id: docRef.id, 
        createdAt: Date.now(),
        updatedAt: Date.now(),
        image: downloadURL
      })
      .then(() => cleanupActions("Created school successfully!"));
      event.preventDefault();
    }
  }

  useEffect(() => {
    const prevContent = props.prevContent;
    if (prevContent) {
      dispatch({ type:"EDIT_STATE", payload: prevContent });
    } else {
      dispatch({ type:"RESET_STATE" });
    }
  }, [dialogOpen, props.prevContent]);

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
          name,
          value,
          label: convertToSentenceCase(name),
          onChange: (name !== 'image') ? onChange : onUpload
        }

        let customComponent;
        switch(name) {
          case 'type':
            customComponent = 
              <StyledValidators.CustomSelect key={name}
                {...defaultProps}
                options={SCHOOL_TYPES}
                label='Institution Type'
                validators={['isSelected']}
                errorMessages={['']}
              />
            break;

          case 'recommendation':
          case 'isFeatured': 
            if (name === 'recommendation') {
              defaultProps.label = 'Goose Recommended';
              defaultProps.helpertext = "Display a 'recommended' badge for this institution.";
            } else if (name === 'isFeatured') {
              defaultProps.label = 'Featured';
              defaultProps.helpertext = 'Display this institution on the home page.';
            }

            customComponent = 
              <StyledValidators.CustomRadioGroup key={name}
                {...defaultProps}
                options={["Yes", "No"]}
                validators={['isSelected']}
                errorMessages={['']}
              />
            break;

          case 'image': 
            customComponent = 
              <Grid container justify='center' alignItems='center' key={name}>
                <Grid item xs={2}>
                  {value ?
                    <Avatar
                      className={classes.avatar}
                      imgProps={{style: { objectFit: 'contain' }}}
                      alt='S'
                      variant='rounded' 
                      src={
                        value instanceof File ? null : value.includes('firebase') ? value : require(`../../../assets/img/${value}`)}/>
                  :
                    <Box height={144} width={144} border={1} borderColor='grey.500' borderRadius={8}/>
                  }
                </Grid>

                <Grid item>
                  <StyledValidators.FileUpload 
                    {...defaultProps}
                    validators={['isRequiredUpload']}
                    errorMessages={['']}/>
                  <FormHelperText>Select a new file to upload and replace current image.</FormHelperText>
                </Grid>

              </Grid>
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
              <Fragment key={name}>
                <StyledValidators.TextField {...defaultProps} />
                <FormHelperText>{customHelperText}</FormHelperText>
              </Fragment>
            break;

          case 'title':
          case 'description': 
            defaultProps.validators = ['required', 'isQuillEmpty'];
            defaultProps.errorMessages = ['', ''];  
            customComponent = <StyledValidators.TextField {...defaultProps} key={name}/>
            break;
          
          default:
            customComponent = <StyledValidators.TextField {...defaultProps} key={name}/>
        }

        return customComponent;
      })}
    </>
  );
}

function uploadStorageImage(uploadTask) {
  return uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
    return downloadURL;
  });
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case "RESET_STATE":
      return { ...INITIAL_STATE }

      case "EDIT_STATE":
      const formFields = new Map();   // to preserve order of form fields;
      formFields.set('image', payload.image);
      formFields.set('title', payload.title);
      formFields.set('type', payload.type);
      formFields.set('location', payload.location);
      formFields.set('url', payload.url);
      formFields.set('dateOfEstablishment', payload.dateOfEstablishment);
      formFields.set('description', payload.description);
      formFields.set('features', payload.features);
      formFields.set('program', payload.program);
      formFields.set('expenses', payload.expenses);
      formFields.set('numberOfStudents', payload.numberOfStudents);
      formFields.set('openingProcess', payload.openingProcess);
      formFields.set('accommodation', payload.accommodation);
      formFields.set('googleUrl', payload.googleUrl);
      formFields.set('youtubeUrl', payload.youtubeUrl);
      payload.recommendation ? formFields.set('recommendation', 'Yes') : formFields.set('recommendation', 'No'); 
      payload.isFeatured ? formFields.set('isFeatured', 'Yes') : formFields.set('isFeatured', 'No');

      const prepopulateForm = Object.fromEntries(formFields.entries());

      return {...prepopulateForm, isEdit: true, isLoading: false}
    
    case "INIT_SAVE":
      return {...state, isLoading: true}

    case "TEXT_INPUT": {
      const inputField = payload.name;
      const inputValue = payload.value;
      return {...state, [inputField]: inputValue}
    }

    case "FILE_UPLOAD":
      if (payload.length) return { ...state, image: payload[0] }
      return { ...state, image: "" }
    
    default:
      console.log("Not a valid dispatch type for SchoolsComposeForm.")
  }
}

export default withFirebase(SchoolsComposeForm);