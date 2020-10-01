import React, { useEffect, useReducer } from "react";
import { Avatar, Box, Button, CircularProgress, FormHelperText, Grid, makeStyles } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { withFirebase } from "../../firebase";
import { TAGS } from "../../../constants/constants";
import StyledValidators from "../../customMUI";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  avatar: {
    width: theme.spacing(18),
    height: theme.spacing(18)
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
  image: "",
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
  const { isEdit, isLoading, ...uploadImageForm } = state;

  const handleTextInput = event => dispatch({type: "TEXT_INPUT", payload: event.target});
  const handleRichTextInput = htmlString => dispatch({type: "RICH_TEXT_INPUT", payload: htmlString});
  const handleFileUpload = event => dispatch({type: "FILE_UPLOAD", payload: event.target.files[0]});

  const onSubmit = async event => {
    const cleanupActions = message => {
      dispatch({type:"RESET_STATE"});
      setSnackbarMessage(message);
      onDialogClose();
    }
    const { image, isFeatured, ...newForm } = uploadImageForm;
    
    // config Firebase collection reference and document content;
    let docRef, content;
    if (formType === 'article') {
      docRef = isEdit ? firebase.article(state.id) : firebase.articles().doc();
      content = {...newForm}
    } else if (formType === 'tip') {
      const { tag, instagramUrl, link1, link2, ...newTipsForm} = newForm;
      docRef = isEdit ? firebase.tip(state.id) : firebase.tips().doc();
      content = {...newTipsForm}
    }
    
    dispatch({type: "INIT_SAVE"});
    if (isEdit) {
      const prevImage = props.prevContent.image;
      if (image === prevImage) {
        docRef.set({ 
          ...content, 
          isFeatured: Boolean(isFeatured === 'Yes'),
          updatedAt: Date.now() 
        }, { merge: true })
        .then(() => cleanupActions(`Updated ${formType} - please refresh to see new changes`));
      } else if (image instanceof File) {
        const uploadTask = firebase.imagesRef(image).put(image);
        const downloadURL = await uploadStorageImage(uploadTask);
        docRef.set({
          ...content,
          image: downloadURL,
          isFeatured: Boolean(isFeatured === 'Yes'),
          updatedAt: Date.now()
        }, { merge: true })
        .then(() => cleanupActions(`Updated ${formType} - please refresh to see new changes!`));
      }

    } else {
      const uploadTask = firebase.imagesRef(image).put(image);
      const downloadURL = await uploadStorageImage(uploadTask);
      docRef.set({
        ...content,
        id: docRef.id,
        authorDisplayName: firebase.getCurrentUser().displayName,
        authorID: firebase.getCurrentUser().uid,
        comments: [],
        createdAt: Date.now(),
        image: downloadURL,
        isFeatured: Boolean(isFeatured === 'Yes'),
        updatedAt: Date.now()
      })
      .then(() => cleanupActions(`Created ${formType} - please refresh to see new changes`));
    }
    event.preventDefault();
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
      <Grid container justify='center' alignItems='center'>
        <Grid item xs={2}>
          {state.image ?
            <Avatar
              className={classes.avatar}
              imgProps={{style: { objectFit: 'contain' }}}
              alt='G'
              variant='rounded' 
              src={
                state.image instanceof File ? null : state.image.includes('firebase') ? state.image : require(`../../../assets/img/${state.image}`)}/>
          :
            <Box height={144} width={144} border={1} borderColor='grey.500' borderRadius={8}/>
          }
        </Grid>

        <Grid item>
          <StyledValidators.FileUpload 
            value={state.image}
            label='Image'
            onChange={handleFileUpload}
            validators={['isRequiredUpload']}
            errorMessages={['']}/>
          <FormHelperText>Select a new file to upload and replace current image.</FormHelperText>
        </Grid>
      </Grid>

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

      <StyledValidators.CustomRadioGroup
        name='isFeatured'
        value={state.isFeatured}
        label='Goose Featured'
        onChange={handleTextInput}
        helpertext={`Display as a featured ${formType} on the home page.`}
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

function uploadStorageImage(uploadTask) {
  return uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
    return downloadURL;
  });
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  
  switch(type) {
    case "RESET_STATE":
      const initialState = payload;
      return {...initialState}

    case "EDIT_STATE":
      const { isFeatured, ...prevContent } = payload;
      const isFeaturedState = isFeatured ? 'Yes' : 'No';
      return {...prevContent, isEdit: true, isLoading: false, isFeatured: isFeaturedState }
    
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
      return (!uploadFile) ? {...state, image: ''} : {...state, image: uploadFile}
    
    default:
      console.log("Not a valid dispatch type for Admin Articles Compose Form.")
  }
}

export default withFirebase(UploadImageForm);