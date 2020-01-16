import React, { useReducer } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, FormLabel, MenuItem, TextField, Select, makeStyles } from '@material-ui/core';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// const useStyles = makeStyles(theme => ({
// }));

const tags = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

const INITIAL_STATE = {
    title: '',
    tag: '',
    content: '',
    instagramURL: '',
    link1: '',
    link2: ''
}

function toggleReducer(state, action) {
    const { type, payload } = action;
    const { name, value } = payload;
    
    switch(type) {
        case 'RICH_TEXT':
            return { ...state, content: payload }

        default:
            return { ...state, [name]: value }
    }
}

function ComposeDialog(props) {
    const { firebase, history, composeOpen, onClose } = props;
    console.log(history)
    // const classes = useStyles(); 

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { title,  tag, content, instagramURL, link1, link2 } = state;

    const onSubmit = event => {
        firebase.articles().add({...state}, { merge: true }) 
        // .then(() => {
        //     history.push('/profile');
        //     })
        // .catch(error => 
        // dispatch({ type: 'error', payload: error }));

        event.preventDefault();
    }
  
    return (
      <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='lg'>
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
            <form autoComplete="off" onSubmit={onSubmit}>
                <FormLabel component="legend">Title</FormLabel>
                <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="title"
                value={title}
                onChange={event => dispatch({ payload: event.target })}/>

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

                <ReactQuill value={content} onChange={value => dispatch({ type: 'RICH_TEXT', payload: value })}/>

                <FormLabel component="legend">Instagram</FormLabel>
                <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }}
                name="instagramURL"
                value={instagramURL}
                onChange={event => dispatch({ payload: event.target })}
                placeholder="https://www.instagram.com/gooseedu/"/>

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
            <Button variant="contained" color="secondary" fullWidth type="submit">Submit</Button>
            </form>
        </DialogContent>
      </Dialog>
    )
}

export default ComposeDialog;