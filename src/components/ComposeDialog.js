import React, { useReducer } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormLabel, MenuItem, TextField, Select, makeStyles } from '@material-ui/core';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { withAuthorization } from '../components/session';

const tags = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

const INITIAL_STATE = {
    isLoading: false,
    isError: false,
    title: '',
    description: '',
    tag: '',
    instagramURL: '',
    link1: '',
    link2: '',
    attachments: ''
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

        default:
            return { ...state, [name]: value }
    }
}

function ComposeDialogBase(props) {
    const { authUser, firebase, history, composeOpen, onClose, composeType } = props;

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { isLoading, title, tag, description, instagramURL, link1, link2, attachments } = state;

    const onSubmit = event => {
        dispatch({ type: 'INITIALIZE_SAVE', payload: { name: '', value: ''} });
        if (composeType === '/networking') {
            const { isLoading, isError, ...articleForm } = state;
            
            firebase.articles().add({
                authorID: authUser.uid,
                authorDisplayName: authUser.displayName,
                comments: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                views: 0,
                ...articleForm
            })
            .then(() => {
                dispatch({ type: 'SUCCESS_SAVE', payload: {name: '', value: ''} });
                onClose();
                history.push('/networking');
                })
            .catch(error => dispatch({ type: 'error', payload: error }))
            event.preventDefault();

        } else if (composeType === '/services') {
            const { isLoading, isError, tag, instagramURL, ...messageForm } = state;
            
            firebase.messages().add({
                authorID: authUser.uid,
                authorDisplayName: authUser.displayName,
                comments: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                views: 0,
                ...messageForm
            })
            .then(() => {
                dispatch({ type: 'SUCCESS_SAVE', payload: {name: '', value: ''} });
                onClose();
                history.push('/services');
                })
            .catch(error => dispatch({ type: 'error', payload: error }))
            event.preventDefault();
        }
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

                { composeType === '/networking' ? 
                <>
                    <FormLabel component="legend">Tag</FormLabel>
                    <Select variant="outlined" displayEmpty
                    name='tag' 
                    value={tag} 
                    onChange={event => dispatch({ payload: event.target })}>
                        <MenuItem value="" disabled>Select One</MenuItem>
                        { tags.map((tag, i) => {
                            return <MenuItem key={i} name={tag} value={tag.toLowerCase()}>{tag}</MenuItem>
                        })}
                    </Select>

                    <FormLabel component="legend">Instagram</FormLabel>
                    <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                    name="instagramURL"
                    value={instagramURL}
                    onChange={event => dispatch({ payload: event.target })}
                    placeholder="https://www.instagram.com/gooseedu/"/>
                </>
                : '' }

                <ReactQuill value={description} onChange={value => dispatch({ type: 'RICH_TEXT', payload: value })}/>

                <FormLabel component="legend">Link #1</FormLabel>
                <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="link1"
                value={link1}
                onChange={event => dispatch({ payload: event.target })}/>

                <FormLabel component="legend">Link #2</FormLabel>
                <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="link2"
                value={link2}
                onChange={event => dispatch({ payload: event.target })}/>

                <Button variant="contained" color="secondary" fullWidth type="submit">
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