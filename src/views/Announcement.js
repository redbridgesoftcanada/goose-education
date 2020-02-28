import React, { Fragment, useReducer } from 'react';
import { Box, Button, Container, Divider, Fab, Grid, IconButton, Menu, MenuItem, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, PrintOutlined, MoreHorizOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { v4 as uuidv4 } from 'uuid';

import { EditorValidator } from '../constants/customValidators';
import parse from 'html-react-parser';
import Typography from '../components/onePirate/Typography';
import { withFirebase } from '../components/firebase';
import CommentDialog from '../components/CommentDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';

const styles = theme => ({
    root: {
        marginTop: theme.spacing(3),
    },
    meta: {
        background: theme.palette.secondary.light,
        color: 'rgba(0, 0, 0, 0.54)',
        opacity: 0.9,
        paddingBottom: theme.spacing(5),
      },
      left: {
        float: 'left',
        display: 'flex',
        justifyContent: 'space-evenly'
      },
      right: {
        float: 'right',
        display: 'flex',
      },
      item: {
        paddingRight: theme.spacing(1),
      },
      image: {
        display: 'block',
        border: '0',
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
      },
      description: {
        textAlign: 'left',
        marginTop: theme.spacing(2),
        paddingBottom: theme.spacing(5),
      },
      print: {
        float: 'right'
      },
});

function printDiv(divName) {
    let printContents = document.getElementById(divName).innerHTML;
    let originalContents = document.body.innerHTML;
  
    document.body.innerHTML = printContents;
  
    window.print();
  
    document.body.innerHTML = originalContents;
}

function toggleReducer(state, action) {
    const { type, payload } = action;
  
    switch(type) {
        case 'NEW_COMMENT': 
            return { ...state, comment: payload }

        case 'OPEN_ACTIONS':
            return { ...state, anchorEl: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, anchorEl: null }
        
        case 'CONFIRM_ACTIONS':
            return { 
                ...state, 
                confirmOpen: !state.confirmOpen,
                ...(!state.confirmOpen) && { anchorEl: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'NEW_EDIT':
            return { 
                ...state,
                dialogOpen: !state.dialogOpen,
                ...(!state.dialogOpen) && { anchorEl: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
    }
}

function Announcement(props) {
    const { authUser, classes, firebase, history, selectedAnnounce } = props;
    
    const INITIAL_STATE = {
        comment: '',
        anchorEl: null,
        confirmOpen: false,
        dialogOpen: false
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, anchorEl, confirmOpen, dialogOpen } = state;
    const anchorOpen = Boolean(anchorEl);

    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget });
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS', payload:null });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleConfirmation = () => dispatch({ type:'CONFIRM_ACTIONS' });
    const handleEdit = prevContent => dispatch({ type: 'NEW_EDIT', payload:prevContent });
    const handleCommentDelete = id => {
        const announcementsRef = firebase.announcement(selectedAnnounce.id);

        firebase.transaction(t => {
        return t.get(announcementsRef).then(doc => {
            const commentsArr = doc.data().comments;

            const filteredCommentsArr = commentsArr.filter(comment => {
            return comment.id !== id
            });

            t.update(announcementsRef, { comments: filteredCommentsArr });
        })})
        .then(() => handleConfirmation())
    }

    const onSubmit = event => {
        firebase.announcement(selectedAnnounce.id).update({ 
            'comments': firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
        })})
        .then(() => { 
            handleComment('');
            history.push({
                pathname: '/services', 
                state: {
                    title: 'Service Centre',
                    selected: 0
                }
        })});
        // .catch(error => dispatch({ type: 'error', payload: error }))
        event.preventDefault();
    }

    return (
        <Container className={classes.root} id='printableArea'>
            <Typography variant='h6' align='left'>
                {(selectedAnnounce && selectedAnnounce.title) ? selectedAnnounce.title : 'New Announcement' }
            </Typography>
            <Box px={3} py={2} className={classes.meta}>
                <div className={classes.left}>
                    <Grid container spacing={1}>
                        <Grid item >
                            <AccountCircleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.item}>{selectedAnnounce.author ? selectedAnnounce.author : ''}</Typography>
                        </Grid>
                        <Grid item >
                            <ChatBubbleOutlineOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.item}>{selectedAnnounce.comments ? selectedAnnounce.comments.length : ''}</Typography>
                        </Grid>
                        <Grid item >
                            <VisibilityOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.item}>{selectedAnnounce.views ? selectedAnnounce.views : ''}</Typography>
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.right}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <ScheduleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2'>{(selectedAnnounce.updatedAt > selectedAnnounce.createdAt) ? format(selectedAnnounce.updatedAt, 'Pp') : format(selectedAnnounce.createdAt, 'Pp')}</Typography>
                        </Grid>
                    </Grid>
                </div>
            </Box>
            <Typography component='div' variant='body2' align='left' className={classes.description}>
                {selectedAnnounce ? selectedAnnounce.description : ''}
            </Typography>
            <Fab size='small' color='secondary' className={classes.print} onClick={() => printDiv('printableArea')}>
                <PrintOutlined />
            </Fab>
            <br/><br/><br/>
            <Divider light/>
            <Typography variant='body1' align='left' className={classes.description}>
                {selectedAnnounce ? selectedAnnounce.comments.length : ''} Comments
            </Typography>
            {selectedAnnounce.comments.map((comment, i) => {
                let isCommentOwner = authUser.uid === comment.authorID;
                return (
                    <Fragment key={i}>
                        <div className={classes.left}>
                            <Typography variant='body2' align='left' color='secondary'>{comment.authorDisplayName}</Typography>
                        </div>
                        <div className={classes.right}>
                            <Typography variant='body2' align='left'>
                                {(comment.updatedAt > comment.createdAt) ? format(comment.updatedAt, 'Pp') : format(comment.createdAt, 'Pp')}
                            </Typography>
                        </div>
                        <br/>
                        <Grid container spacing={1} justify='space-between'>
                            <Grid item xs={11}>
                                <Typography component='span' variant='body2' align='left'>{parse(comment.description)}</Typography>
                            </Grid>
                            
                            {/* EDIT & DELETE FEATURE FOR COMMENT OWNER */}
                            {isCommentOwner &&
                            <>
                                <Grid item>
                                    <IconButton onClick={openPostActions}>
                                        <MoreHorizOutlined/>
                                    </IconButton>
                                    <Menu
                                        keepMounted
                                        anchorEl={anchorEl}
                                        open={anchorOpen}
                                        onClose={closePostActions}
                                    >
                                        <MenuItem onClick={() => handleEdit(comment.description)}>Edit comment</MenuItem>
                                        <MenuItem onClick={handleConfirmation}>Delete comment</MenuItem>
                                    </Menu>
                                </Grid>

                                <CommentDialog firebase={firebase} selectedResource={selectedAnnounce} prevComment={comment} open={dialogOpen} onClose={handleEdit}/>
                                <DeleteConfirmation deleteType='comment' open={confirmOpen} handleDelete={() => handleCommentDelete(comment.id)} onClose={handleConfirmation}/>
                            </>
                            }
                        </Grid>
                    </Fragment>
                )
            })}
            <br/>
            <div>
                <ValidatorForm className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
                    <EditorValidator 
                        {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}
                        value={comment}
                        onChange={handleComment}
                        validators={['isQuillEmpty']}
                        errorMessages={['Cannot submit an empty post.']}/>
                    <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
                </ValidatorForm>
            </div>
        </Container>
    )
}

export default withStyles(styles)(withFirebase(Announcement));