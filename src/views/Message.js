import React, { Fragment, useReducer } from 'react';
import { Box, Button, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, MoreVertOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import parse from 'html-react-parser';
import { withFirebase } from '../components/firebase';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ComposeDialog from '../components/ComposeDialog';

const styles = theme => ({
    mt3: {
        marginTop: theme.spacing(3),
    },
    pr1: {
        paddingRight: theme.spacing(1),
    },
    meta: {
      background: theme.palette.secondary.light,
      color: 'rgba(0, 0, 0, 0.54)',
      opacity: 0.9,
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
    image: {
      display: 'block',
      border: '0',
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
});

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

function Message(props) {
    const { authUser, classes, firebase, history, match, selectedMessage } = props;

    const INITIAL_STATE = {
        comment: '',
        anchorEl: null,
        confirmOpen: false,
        dialogOpen: false
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, anchorEl, confirmOpen, dialogOpen } = state;
    const anchorOpen = Boolean(anchorEl);
    
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS', payload:null });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleConfirmation = () => dispatch({ type:'CONFIRM_ACTIONS' });
    const handleEdit = () => dispatch({ type: 'NEW_EDIT' });
    const handleDelete = () => firebase.deleteMessage(selectedMessage.id).then(() => history.push('/services'));

    let isMessageOwner;
    if (!selectedMessage) {
      return null;
    } else {
      isMessageOwner = (authUser.uid === selectedMessage.authorID);
    }

    const onSubmit = event => {
        firebase.message(selectedMessage.id).update({ 
            "comments": firebase.updateArray().arrayUnion({
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }) 
        })
        .then(() => { 
            handleComment('');
            history.push('/services') 
        })
        // .catch(error => dispatch({ type: 'error', payload: error }))
        event.preventDefault();
    }

    return (
        <Container className={classes.root}>
            <Typography variant='h6' align='left'>{selectedMessage.title}</Typography>

            {/* METADATA: [author, tag, number of comments, number of views, date created/updated] */}
            <Box px={3} py={2} pb={4} className={classes.meta}>
                <Box className={classes.left}>
                    <Grid container spacing={1}>
                        <Grid item >
                            <AccountCircleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>{selectedMessage.authorDisplayName}</Typography>
                        </Grid>
                        <Grid item>
                            <ChatBubbleOutlineOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>{selectedMessage.comments.length}</Typography>
                        </Grid>
                        <Grid item >
                            <VisibilityOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>{selectedMessage.views}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box className={classes.right}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <ScheduleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2'>{(selectedMessage.updatedAt > selectedMessage.createdAt) ? format(selectedMessage.updatedAt, 'Pp') : format(selectedMessage.createdAt, 'Pp')}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            
            {/* CONTENT */}
            <Grid container justify='space-between'>
                <Grid item xs={11}>
                    <Typography component='span' variant='body2' align='left' className={classes.mt3}>
                        {parse(selectedMessage.description)}
                    </Typography>
                </Grid>

                <Grid item>
                    {isMessageOwner &&
                    <>
                        <IconButton onClick={openPostActions}>
                            <MoreVertOutlined/>
                        </IconButton>
                        <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            open={anchorOpen}
                            onClose={closePostActions}
                        >
                            <MenuItem onClick={handleEdit}>Edit message</MenuItem>
                            <MenuItem onClick={handleConfirmation}>Delete message</MenuItem>
                        </Menu>
                    </>
                    }
                </Grid>
            </Grid>

            {/* EDIT & DELETE FEATURE FOR ARTICLE OWNER */}
            <ComposeDialog
                isEdit={true}
                article={selectedMessage}
                authUser={authUser} 
                composeType='message'
                composeOpen={dialogOpen} 
                onClose={handleEdit} 
            />
            <DeleteConfirmation deleteType='message' open={confirmOpen} handleDelete={handleDelete} onClose={handleConfirmation}/>

            <Divider light/>
            <Typography variant='body1' align='left' className={classes.mt3}>
                {selectedMessage ? selectedMessage.comments.length : ''} Comments
            </Typography>
            {selectedMessage && selectedMessage.comments.length ? selectedMessage.comments.map((comment, i) => {
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
                        <Typography variant='body2' align='left'>{parse(comment.description)}</Typography>
                    </Fragment>
                )
            })
            : <Typography>There are currently no comments.</Typography> }
            <br/>
            <div>
                <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
                    <ReactQuill 
                    {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}
                    value={comment} 
                    onChange={handleComment} />
                    <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
                </form>
            </div>
        </Container>
    )
}

export default withStyles(styles)(withFirebase(Message));