import React, { useReducer } from 'react';
import { Box, Button, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, MoreVertOutlined, DescriptionOutlined, LanguageOutlined, Facebook, Instagram, RoomOutlined } from '@material-ui/icons';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { EditorValidator } from '../constants/customValidators';
import { withFirebase } from '../components/firebase';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ComposeDialog from '../components/ComposeDialog';
import Comments from '../components/Comments';

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
    link: {
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    }
});

function generateLinks(classes, link) {
    const isFacebook = link.includes('facebook');
    const isInstagram = link.includes('instagram');
    const isMaps = link.includes('map');

    return (
        <Grid container className={classes.link} spacing={1} onClick={() => window.open(link, "_blank")}>
            <Grid item>
                {isFacebook ? <Facebook fontSize='small'/> 
                :
                isInstagram ? <Instagram fontSize='small'/>
                :
                isMaps ? <RoomOutlined fontSize='small'/>
                :
                <LanguageOutlined fontSize='small'/>}
            </Grid>
            <Grid item>
                <Typography variant='body2'>{link}</Typography>
            </Grid>
        </Grid>
    );
}

function toggleReducer(state, action) {
    const { type, payload } = action;
  
    switch(type) {
        case 'NEW_COMMENT': 
            return { ...state, comment: payload }

        case 'OPEN_ACTIONS':
            const anchorKey = (payload.id === 'message') ? 'editAnchor' : 'commentAnchor';
            return { ...state, [anchorKey]: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
        case 'CONFIRM_DELETE':
            const confirmKey = (payload.id === 'message') ? 'editConfirmOpen' : 'commentConfirmOpen';
            return { 
                ...state, 
                [confirmKey]: !state[confirmKey],
                ...(!state[confirmKey]) && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'EDIT_CONTENT':
            const dialogKey = (payload.id === 'message') ? 'editDialogOpen' : 'commentDialogOpen';
            return { 
                ...state, 
                [dialogKey]: !state[dialogKey],
                ...(!state[dialogKey]) && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'RESET_ACTIONS': {
            return { 
                ...state, 
                commentAnchor: null,
                commentConfirmOpen: false,
                commentDialogOpen: false,
                editAnchor: null,
                editConfirmOpen: false,
                editDialogOpen: false
            }
        }
    }
}

function Message(props) {
    const { authUser, classes, firebase, history, selectedMessage } = props;
    
    const INITIAL_STATE = {
        comment: '',
        commentAnchor: null,
        commentDialogOpen: false,
        commentConfirmOpen: false,
        editAnchor: null,
        editDialogOpen: false,
        editConfirmOpen: false
    }

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, commentAnchor, commentDialogOpen, commentConfirmOpen, editAnchor, editConfirmOpen, editDialogOpen } = state;
    const commentAnchorOpen = Boolean(commentAnchor);
    const editAnchorOpen = Boolean(editAnchor);
    
    const redirectPath = () => history.push({ pathname: '/services', state: { title: 'Service Centre', selected: 1 }});
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleMessageDelete = () => firebase.deleteMessage(selectedMessage.id).then(() => redirectPath());

    const handleCommentDelete = id => {
        const messagesRef = firebase.message(selectedMessage.id);

        firebase.transaction(t => {
        return t.get(messagesRef).then(doc => {
            const commentsArr = doc.data().comments;

            const filteredCommentsArr = commentsArr.filter(comment => {
            return comment.id !== id
            });

            t.update(messagesRef, { comments: filteredCommentsArr });
        })}).then(() => handleDeleteConfirmation())
    }

    let isMessageOwner;
    if (!selectedMessage) {
      return null;
    } else {
      isMessageOwner = (authUser.uid === selectedMessage.authorID);
    }

    const onSubmit = event => {
        firebase.message(selectedMessage.id).update({ 
            'comments': firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
        })}).then(() => { 
            handleComment('');
            redirectPath();
           })
        // .catch(error => dispatch({ type: 'error', payload: error }))
        event.preventDefault();
    }

    return (
        <Container className={classes.root}>
            <Typography variant='h6' align='left'>{selectedMessage.title}</Typography>

            {/* M E T A D A T A [author, tag, number of comments, number of views, date created/updated] */}
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
                        {selectedMessage.attachments &&
                        <>
                            <Grid item >
                                <DescriptionOutlined/>
                            </Grid>
                            <Grid item>
                                <Typography variant='body2' className={classes.pr1}>File(s) Attached</Typography>
                            </Grid>
                        </>
                        }
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
            
            {/* C O N T E N T */}
            <Grid container justify='space-between'>
                <Grid item xs={11}>
                    <Typography component='span' variant='body2' align='left' className={classes.mt3}>
                        {parse(selectedMessage.description)}
                    </Typography>
                </Grid>

                <Grid item>
                    {isMessageOwner &&
                    <>
                        <IconButton id='message' onClick={openPostActions}>
                            <MoreVertOutlined/>
                        </IconButton>
                        <Menu
                            keepMounted
                            anchorEl={editAnchor}
                            open={editAnchorOpen}
                            onClose={closePostActions}
                        >
                            {selectedMessage.attachments && <MenuItem onClick={()=> window.open(selectedMessage.attachments, "_blank")}>Download attachment(s)</MenuItem>}
                            <MenuItem id='message' onClick={handleEdit}>Edit message</MenuItem>
                            <MenuItem id='message' onClick={handleDeleteConfirmation}>Delete message</MenuItem>
                        </Menu>
        
                        {/* E D I T  &  D E L E T E  F E A T U R E */}
                        <ComposeDialog
                            isEdit={true}
                            article={selectedMessage}
                            authUser={authUser} 
                            composeType='message'
                            composeOpen={editDialogOpen} 
                            onClose={resetAllActions} 
                        />

                        <DeleteConfirmation deleteType='message' open={editConfirmOpen} handleDelete={handleMessageDelete} onClose={handleDeleteConfirmation}/>
                    </>
                    }
                </Grid>
            </Grid>

            {selectedMessage.link1 && generateLinks(classes, selectedMessage.link1)}
            {selectedMessage.link2 && generateLinks(classes, selectedMessage.link2)} 

            <Divider light/>

            {/* C O M M E N T S */}
            <Typography variant='body1' align='left' className={classes.mt3}>
                {selectedMessage ? selectedMessage.comments.length : ''} Comments
            </Typography>
            {selectedMessage && selectedMessage.comments.length ? selectedMessage.comments.map((comment, i) => {
                let isCommentOwner = authUser.uid === comment.authorID;
                return (
                    <Comments i={i} classes={classes} comment={comment} isCommentOwner={isCommentOwner} firebase={firebase} formType={'message'} openPostActions={openPostActions} closePostActions={closePostActions} commentAnchor={commentAnchor} commentAnchorOpen={commentAnchorOpen} commentDialogOpen={commentDialogOpen} commentConfirmOpen={commentConfirmOpen} selectedResource={selectedMessage} handleEdit={handleEdit} handleDeleteConfirmation={handleDeleteConfirmation} resetAllActions={resetAllActions} /> 
            )})
            : <Typography>There are currently no comments.</Typography> }
            <br/>
            <div>
                <ValidatorForm className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
                    <EditorValidator 
                        {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}
                        defaultValue={comment}
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

export default withStyles(styles)(withFirebase(Message));