import React, { useReducer } from 'react';
import { Button, Collapse, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, ScheduleOutlined, MoreVertOutlined, LanguageOutlined, Facebook, Instagram, RoomOutlined, EditOutlined, DeleteOutline } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { format, compareAsc } from 'date-fns';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { MuiThemeBreakpoints } from '../constants/constants';
import { withFirebase } from '../components/firebase';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ComposeDialog from '../components/ComposeDialog';
import StyledValidators from '../components/customMUI';
import Comments from '../components/Comments';
import useStyles from '../styles/serviceCentre.js';

const INITIAL_STATE = {
    comment: '',
    commentCollapseOpen: true,
    editAnchor: null,
    editDialogOpen: false,
    editConfirmOpen: false
}

function Message(props) {
    const classes = useStyles(props);
    const history = useHistory();
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const { authUser, firebase, selectedMessage } = props;

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, commentCollapseOpen, editAnchor, editConfirmOpen, editDialogOpen } = state;
    const editAnchorOpen = Boolean(editAnchor);
    
    const redirectPath = () => history.push({ pathname: '/services', state: { title: 'Service Centre', tab: 1 }});
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = event => dispatch({ type:'NEW_COMMENT', payload: event.target.value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleCollapse = () => dispatch({ type: 'TRIGGER_COLLAPSE' });
    const handleMessageDelete = () => firebase.deleteMessage(selectedMessage.id).then(() => redirectPath());

    let isMessageOwner;
    if (!selectedMessage) {
      return null;
    } else {
      isMessageOwner = (authUser.uid === selectedMessage.authorID);
    }

    const onCommentSubmit = event => {
        firebase.message(selectedMessage.id).update({ 
            'comments': firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
        })});
        event.preventDefault();
    }

    const CommentFormField = 
        <ValidatorForm onSubmit={onCommentSubmit}>
            <StyledValidators.TextField
                multiline
                rows={5}
                value={comment}
                onChange={handleComment}
                validators={['isQuillEmpty']}
                errorMessages={['']}/>
            <Button className={classes.commentButton} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
        </ValidatorForm>

    return (
        <Container>
            <Typography className={classes.title}>{selectedMessage.title}</Typography>

            <Grid container className={classes.metaContainer}>
                <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
                    <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{selectedMessage.authorDisplayName}</Typography>
                    </Grid>

                    <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{selectedMessage.comments.length}</Typography>
                    </Grid>
                    
                    {selectedMessage.link1 && generateLinks(classes, selectedMessage.link1)}
                    {selectedMessage.link2 && generateLinks(classes, selectedMessage.link2)}
                </Grid>

                <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
                    <Grid item><ScheduleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>
                            {format([selectedMessage.createdAt, selectedMessage.updatedAt].sort(compareAsc).pop(), 'P')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {!xsBreakpoint ?
            <>
                {parse(selectedMessage.description)}

                {isMessageOwner &&
                    <Grid container className={classes.announceActions}>
                        <Grid item sm={4}>
                            <Button onClick={handleCollapse} fullWidth className={classes.announceButtons}>
                                <ChatBubbleOutlineOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='message' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                                <EditOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='message' onClick={handleDeleteConfirmation} fullWidth className={classes.announceButtons}>
                                <DeleteOutline/>
                            </Button>
                        </Grid>
                    </Grid>
                }
            </> 
            : 
            <Grid container className={classes.announceContainer}>
                {!isMessageOwner ? 
                <Grid item>{parse(selectedMessage.description)}</Grid> 
                :
                <>
                    <Grid item xs={9}>{parse(selectedMessage.description)}</Grid>
                    <Grid item>
                        <IconButton id='message' onClick={openPostActions}>
                            <MoreVertOutlined/>
                        </IconButton>
                    </Grid>
                </>
                }
            </Grid>
            }

            {/* Conditional Components - Edit + Delete Features */}
            <Menu
                keepMounted
                anchorEl={editAnchor}
                open={editAnchorOpen}
                onClose={closePostActions}>
                <MenuItem id='message' onClick={handleEdit}>Edit</MenuItem>
                <MenuItem id='message' onClick={handleDeleteConfirmation}>Delete</MenuItem>
            </Menu>

             <ComposeDialog
                isEdit={true}
                article={selectedMessage}
                authUser={authUser} 
                composeType='message'
                composeOpen={editDialogOpen} 
                onClose={resetAllActions}/>
            
            <DeleteConfirmation 
                deleteType='message' 
                open={editConfirmOpen} 
                handleDelete={handleMessageDelete} 
                onClose={handleDeleteConfirmation}/>

            <Divider light/>

            <Typography className={classes.commentHeader}>
                {selectedMessage.comments.length} Comments
            </Typography>

            {
                !authUser ? 
                <Typography>Please login/register to post comments.</Typography>
                :
                !xsBreakpoint && isMessageOwner ? 
                <Collapse in={commentCollapseOpen} timeout="auto" unmountOnExit>
                    {CommentFormField}
                </Collapse>
                :
                CommentFormField
            }

            {!!selectedMessage.comments.length && 
                <Comments 
                    formType='message'
                    authUser={authUser}
                    selectedResource={selectedMessage}
                    listOfComments={selectedMessage.comments}/> 
            }

        </Container>
    )
}

function generateLinks(classes, link) {
    const isFacebook = link.includes('facebook');
    const isInstagram = link.includes('instagram');
    const isMaps = link.includes('map');

    return (
        <Grid item>
            <IconButton className={classes.announceSocialButtons} onClick={() => window.open(link, "_blank")}>
                {isFacebook ? <Facebook fontSize='small'/> 
                :
                isInstagram ? <Instagram fontSize='small'/>
                :
                isMaps ? <RoomOutlined fontSize='small'/>
                :
                <LanguageOutlined fontSize='small'/>}
            </IconButton>
        </Grid>
    );
}

function toggleReducer(state, action) {
    const { type, payload } = action;
  
    switch(type) {
        case 'NEW_COMMENT': 
            return { ...state, comment: payload }

        case 'OPEN_ACTIONS':
            return { ...state, editAnchor: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
        case 'TRIGGER_COLLAPSE':
            return { ...state, commentCollapseOpen: !state.commentCollapseOpen}
                
        case 'CONFIRM_DELETE':
            return { 
                ...state, 
                editConfirmOpen: !state.editConfirmOpen,
                ...!state.editConfirmOpen && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'EDIT_CONTENT':
            return { 
                ...state, 
                editDialogOpen: !state.editDialogOpen,
                ...!state.editDialogOpen && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
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

        default:
    }
}

export default withFirebase(Message);