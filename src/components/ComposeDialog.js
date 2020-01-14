import React from 'react';
import { Button, Dialog, DialogTitle, FormLabel, TextField, makeStyles, DialogContent } from '@material-ui/core';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const useStyles = makeStyles(theme => ({
}));

function ComposeDialog({ onClose, composeOpen }) {
    const classes = useStyles(); 
  
    return (
      <Dialog onClose={onClose} open={composeOpen} fullWidth maxWidth='lg'>
        <DialogTitle className={classes.title}>Create Post</DialogTitle>
        <DialogContent>
            <div>
                <FormLabel component="legend" >Instagram</FormLabel>
                <TextField
                variant="outlined"
                fullWidth
                name="instagram"
                // value={email}
                // onChange={onChange}
                type="text"
                placeholder="https://www.instagram.com/gooseedu/"
                InputLabelProps={{ shrink: true }}/>
            </div>
            <div>
                <FormLabel component="legend" >Title</FormLabel>
                <TextField
                variant="outlined"
                fullWidth
                name="title"
                // value={email}
                // onChange={onChange}
                type="text"
                // placeholder="https://www.instagram.com/gooseedu/"
                InputLabelProps={{ shrink: true }}/>
            </div>
            
            <ReactQuill/>
            <div>
                <FormLabel component="legend" >Link #1</FormLabel>
                <TextField
                variant="outlined"
                fullWidth
                name="link1"
                // value={email}
                // onChange={onChange}
                type="text"
                InputLabelProps={{ shrink: true }}/>
            </div>
            <div>
                <FormLabel component="legend" >Link #2</FormLabel>
                <TextField
                variant="outlined"
                fullWidth
                name="link2"
                // value={email}
                // onChange={onChange}
                type="text"
                InputLabelProps={{ shrink: true }}/>
            </div>
        </DialogContent>
        <Button variant="contained" color="secondary">Submit</Button>
      </Dialog>
    )
}

export default ComposeDialog;