import React, { useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, MenuItem, TextField, Select, Input } from '@material-ui/core';
import { withAuthorization } from '../components/session';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const tags = ['Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

const INITIAL_STATE = {
    isLoading: false,
    isError: false,
    title: '',
    description: '',
    tag: '',
    instagramURL: '',
    link1: '',
    link2: '',
    uploads: []
}

function toggleReducer(state, action) {
    const { type, payload } = action;
    const { name, value } = payload;
    
    switch(type) {
        case 'INITIALIZE_SAVE':
            return {
                ...state,
                isLoading: true,
                isError: false }
        
        case 'SUCCESS_SAVE':
            return { ...INITIAL_STATE }

        case 'RICH_TEXT':
            return { ...state, description: payload }

        case 'FILE_UPLOAD':
            const uploadFile = payload;
            return { ...state, uploads: uploadFile}

        default:
            return { ...state, [name]: value }
    }
}

function ComposeDialogBase(props) {
    const { authUser, firebase, history, composeOpen, onClose, composeType } = props;

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { isLoading, title, tag, description, instagramURL, link1, link2 } = state;

    // const isButtonDisabled = () => {
    //   switch (activeStep) {
    //     case 0:
    //       return !(allTermsAgreed || gooseTermsAndConditions && collectionPersonalInfo);
  
    //     case 1:
    //       return username === "" || email === "" || passwordOne === "" || passwordOne !== passwordTwo;
  
    //     case 2: 
    //       return firstName === "" || lastName === ""; 
    //   }
    // }

    const onSubmit = event => {
      dispatch({ type: 'INITIALIZE_SAVE', payload: { name: '', value: ''} });

      let uploadRef, uploadKey, formContent, newDoc;
      
      if (composeType === '/networking') {
        const { isLoading, isError, uploads, ...articleForm } = state;
        uploadRef = firebase.images(uploads);
        uploadKey = 'image';
        formContent = {...articleForm};
        newDoc = firebase.articles().doc();
      } else if (composeType === '/services') {
        const { isLoading, isError, tag, instagramURL, uploads, ...messageForm } = state;
        uploadRef = firebase.attachments(uploads);
        uploadKey = 'attachments';
        formContent = {...messageForm};
        newDoc = firebase.messages().doc();
      }
      uploadRef.on('state_changed', function(snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, function(error){
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
        
            case 'storage/canceled':
              // User canceled the upload
              break;
        
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          uploadRef.snapshot.ref.getDownloadURL().then(downloadURL => {
            newDoc.set({
              id: newDoc.id,
              authorID: authUser.uid,
              authorDisplayName: authUser.displayName,
              comments: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
              views: 0,
              [uploadKey]: downloadURL, 
              ...formContent
            })
            .then(() => {
              dispatch({ type: 'SUCCESS_SAVE', payload: {name: '', value: ''} });
              onClose();
              history.push('/networking')})
            .catch(error => dispatch({ type: 'error', payload: error }))})});

      event.preventDefault();
    }
  
    return (
      <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='md'>
        <DialogTitle>{ composeType === '/networking' ? 'Create Post' : 'Create Counselling Request' }</DialogTitle>
        <DialogContent>
            <form autoComplete="off" onSubmit={onSubmit}>
                <FormLabel component="legend">Title</FormLabel>
                <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="title"
                value={title}
                onChange={event => dispatch({ payload: event.target })}/>

                { composeType === '/networking' &&
                <>
                    <FormLabel component="legend">Tag</FormLabel>
                    <Select variant="outlined" displayEmpty
                    name='tag' 
                    value={tag} 
                    onChange={event => dispatch({ payload: event.target })}>
                        <MenuItem value="" disabled>Select One</MenuItem>
                        { tags.map((tag, i) => {
                            return <MenuItem key={i} name={tag} value={tag}>{tag}</MenuItem>
                        })}
                    </Select>

                    <FormLabel component="legend">Instagram</FormLabel>
                    <TextField type="url" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                    name="instagramURL"
                    value={instagramURL}
                    onChange={event => dispatch({ payload: event.target })}
                    placeholder="https://www.instagram.com/gooseedu/"/>
                </>
                }

                <ReactQuill value={description} onChange={value => dispatch({ type: 'RICH_TEXT', payload: value })}/>

                <FormLabel component="legend">Link #1</FormLabel>
                <TextField type="url" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="link1"
                value={link1}
                onChange={event => dispatch({ payload: event.target })}/>

                <FormLabel component="legend">Link #2</FormLabel>
                <TextField type="url" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="link2"
                value={link2}
                onChange={event => dispatch({ payload: event.target })}/>

                <FormLabel component="legend">Uploads</FormLabel>

                <Input type="file" onChange={event => dispatch({ type: 'FILE_UPLOAD', payload: event.target.files[0] })}>Upload</Input>

                <Button variant="contained" color="secondary" fullWidth type="submit"
                // disabled={isButtonDisabled()}
                >
                { isLoading ? <CircularProgress /> : 'Submit' }
                </Button>
            </form>
        </DialogContent>
      </Dialog>
    )
}

// const composeDialog = withStyles(styles)(ComposeDialogBase);
const composeDialog = ComposeDialogBase;
const condition = authUser => !!authUser;

export default withAuthorization(condition)(composeDialog);