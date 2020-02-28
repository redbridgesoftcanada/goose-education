import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function DeleteConfirmation({deleteType, open, handleDelete, onClose}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {deleteType === 'article' ? 'Delete this post?' : deleteType === 'message' ? 'Delete this message?' : 'Delete this comment?'}</DialogTitle>
            <DialogContent>
                <DialogContentText>{deleteType === 'article' ? 'Deleted posts cannot be recovered.' : deleteType === 'message' ? 'Deleted messages cannot be recovered.' : 'Deleted comments cannot be recovered.'}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button onClick={handleDelete} color="secondary">DELETE</Button>
            </DialogActions>
        </Dialog>
    );
}