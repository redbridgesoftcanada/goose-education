import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function DeleteConfirmation(props) {
    const { deleteType, open, handleDelete, onClose } = props;

    let title, content;
    switch (deleteType) {
        case 'article':
            title = 'Delete this post?';
            content = 'Deleted posts cannot be recovered.';
            break;

        case 'message':
            title = 'Delete this message?';
            content = 'Deleted messages cannot be recovered.';
            break;
        
        case 'admin_user':
            title = 'Delete this user?';
            content = 'Deleted users cannot be recovered.';
            break;
        
        case 'admin_school':
            title = 'Delete this school?';
            content = 'Deleted schools cannot be recovered.';
            break;

        case 'admin_application':
            title = 'Delete this application?';
            content = 'Deleted applications cannot be recovered.';
            break;
            
        default:
            title = 'Delete this comment?';
            content = 'Deleted comments cannot be recovered.';
        
        return title, content;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button onClick={handleDelete} color="secondary">DELETE</Button>
            </DialogActions>
        </Dialog>
    );
}