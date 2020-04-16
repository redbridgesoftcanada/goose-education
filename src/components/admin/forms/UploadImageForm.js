import React, { useEffect, useReducer } from "react";
import { Button, CircularProgress, FormLabel, Input, makeStyles } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { withFirebase } from "../../firebase";
import { TAGS } from "../../../constants/constants";
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

function UploadImageForm(props) {
  const classes = useStyles();
  const { dialogOpen, onDialogClose, setSnackbarMessage, firebase, formType } = props;

  // S T A T E
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
          ...!isEdit && { createdAt: Date.now(), views: 0 },
          ...formContent
        }, { merge: true })
        .then(() => {
          dispatch({type:"RESET_STATE", payload: INITIAL_STATE});
          !isEdit ? setSnackbarMessage("Created successfully!") : setSnackbarMessage("Updated successfully!");
          onDialogClose();
    })});
    event.preventDefault();
    });
  }

  return (
    <ValidatorForm onSubmit={onSubmit}>
      <div>
        <FormLabel component="legend">Title</FormLabel>
        {COMPONENTS.textField("title", state.title, handleTextInput, false)}

        {formType === "article" &&
          <>
            <FormLabel component="legend">Tag</FormLabel>
            {COMPONENTS.selectField("tag", state.tag, TAGS, handleTextInput)}

            <FormLabel component="legend">Instagram</FormLabel>
            {COMPONENTS.textField("instagramURL", state.instagramURL, handleTextInput, false)}
          </>
        }

        <FormLabel component="legend">Description</FormLabel>
        {COMPONENTS.richTextValidator("description", state.description, handleRichTextInput)}

        {formType === "article" && 
          <>
            <FormLabel component="legend">Link #1</FormLabel>
            {COMPONENTS.textField("link1", state.link1, handleTextInput, false)}

            <FormLabel component="legend">Link #2</FormLabel>
            {COMPONENTS.textField("link2", state.link2, handleTextInput, false)}
          </>
        }
        
        <FormLabel component="legend">Image</FormLabel>
        {(state.image) &&
          <img className={classes.image} src={(state.image.includes('firebase')) ? state.image : require(`../../../assets/img/${state.image}`)} alt="cover image"/>
        }
        <div>
          <Input type="file" disableUnderline onChange={handleFileUpload}/>
        </div>

        <FormLabel component="legend">Goose Featured</FormLabel>
        {COMPONENTS.radioField("isFeatured", state.isFeatured, [{value: true, label:"Yes"}, {value: false, label:"No"}], handleTextInput, `Display as a featured ${formType} on the home page.`)}
      </div>

      <Button className={classes.button} onClick={onDialogClose}>
        Cancel
      </Button>

      <Button type="submit" color="secondary" autoFocus className={classes.button}>
        {state.isLoading ? <CircularProgress /> : "Save"}
      </Button>

    </ValidatorForm>
  );
}

export default withFirebase(UploadImageForm);