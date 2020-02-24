import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function DeleteConfirmation({open, handleDelete, onClose}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogContent>
                <DialogContentText>Deleted posts cannot be recovered.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button onClick={handleDelete} color="secondary">DELETE</Button>
            </DialogActions>
        </Dialog>
    );
}