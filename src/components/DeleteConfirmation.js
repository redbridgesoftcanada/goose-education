import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function DeleteConfirmation({deleteType, open, handleDelete, onClose}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {deleteType === 'article' ? 'Delete this post?' : 'Delete this message?'}</DialogTitle>
            <DialogContent>
                <DialogContentText>{deleteType === 'article' ? 'Deleted posts cannot be recovered.' : 'Deleted messages cannot be recovered.'}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button onClick={handleDelete} color="secondary">DELETE</Button>
            </DialogActions>
        </Dialog>
    );
}