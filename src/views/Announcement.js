import React, { useReducer } from 'react';
import { Button, Collapse, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined, EditOutlined, DeleteOutline } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import { format, compareDesc } from 'date-fns';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withFirebase } from '../components/firebase';
import Comments from '../components/Comments';
import ComposeDialog from '../components/ComposeDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';
import StyledValidators from '../components/customMUI';
import useStyles from '../styles/serviceCentre';

function Announcement(props) {
    const classes = useStyles(props, 'announcement');
    const history = useHistory();
    const theme = useTheme();
    const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));
    const { authUser, firebase, selectedAnnounce } = props;

    const INITIAL_STATE = {
        comment: '',
        commentAnchor: null,
        commentCollapseOpen: false,
        commentDialogOpen: false,
        commentConfirmOpen: false,
        editAnchor: null,
        editDialogOpen: false,
        editConfirmOpen: false
    }

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, commentAnchor, commentCollapseOpen, commentDialogOpen, commentConfirmOpen, editAnchor, editConfirmOpen, editDialogOpen } = state;
    const commentAnchorOpen = Boolean(commentAnchor);
    const editAnchorOpen = Boolean(editAnchor);
    const isLoggedInAdmin = authUser && authUser.roles['admin'];

    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleCollapse = e => {
        dispatch({ type: 'TRIGGER_COLLAPSE' })
    }
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleAnnounceDelete = () => firebase.deleteArticle(selectedAnnounce.id).then(() => redirectPath());

    const commentsProps = { 
        formType: 'announcement', 
        selectedResource: selectedAnnounce, 
        classes, 
        firebase, 
        commentAnchor, 
        commentAnchorOpen, 
        commentDialogOpen, 
        commentConfirmOpen, 
        openPostActions, 
        closePostActions, 
        handleEdit, 
        handleDeleteConfirmation, 
        resetAllActions 
    }

    const redirectPath = () => history.push({ 
        pathname: '/services', state: { title: 'Service Centre', tab: 0 }});

    const onCommentSubmit = event => {
        firebase.announcement(selectedAnnounce.id).update({ 
            'comments': firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
        })})
        .then(() => { redirectPath() });
        // .catch(error => dispatch({ type: 'error', payload: error }))
        event.preventDefault();
    }
    

    return (
        <Container>
            <Typography className={classes.title}>{selectedAnnounce.title}</Typography>

            <Grid container className={classes.metaContainer}>
                <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
                    <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{selectedAnnounce.authorDisplayName}</Typography>
                    </Grid>

                    <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{selectedAnnounce.comments.length}</Typography>
                    </Grid>
                    
                    {selectedAnnounce.link1 && generateLinks(classes, selectedAnnounce.link1)}
                    {selectedAnnounce.link2 && generateLinks(classes, selectedAnnounce.link2)}
                </Grid>

                <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
                    <Grid item><ScheduleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>
                            {format([selectedAnnounce.createdAt, selectedAnnounce.updatedAt].sort(compareDesc).pop(), 'P')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {!xsBreakpoint ?
            <>
                <Typography>{parse(selectedAnnounce.description)}</Typography>

                {isLoggedInAdmin &&
                    <Grid container className={classes.announceActions}>
                        <Grid item sm={4}>
                            <Button onClick={handleCollapse} fullWidth className={classes.announceButtons}>
                                <ChatBubbleOutlineOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='announce' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                                <EditOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='announce' onClick={handleDeleteConfirmation} fullWidth className={classes.announceButtons}>
                                <DeleteOutline/>
                            </Button>
                        </Grid>
                    </Grid>
                }
            </> 
            : 
            <Grid container className={classes.announceContainer}>
                <Grid item xs={9}>
                    <Typography>{parse(selectedAnnounce.description)}</Typography>
                </Grid>

                <Grid item>
                    <IconButton id='announce' onClick={openPostActions}>
                        <MoreVertOutlined/>
                    </IconButton>
                </Grid>
            </Grid>
            }

            {/* Conditional Components - Edit + Delete Features */}
            <Menu
                keepMounted
                anchorEl={editAnchor}
                open={editAnchorOpen}
                onClose={closePostActions}>
                <MenuItem id='announce' onClick={handleEdit}>Edit</MenuItem>
                <MenuItem id='announce' onClick={handleDeleteConfirmation}>Delete</MenuItem>
            </Menu>

             <ComposeDialog
                isEdit={true}
                article={selectedAnnounce}
                authUser={authUser} 
                composeType='announce'
                composeOpen={editDialogOpen} 
                onClose={resetAllActions}/>
            
            <DeleteConfirmation 
                deleteType='admin_announce' 
                open={editConfirmOpen} 
                handleDelete={handleAnnounceDelete} 
                onClose={handleDeleteConfirmation}/>

            <Divider light/>

            <Typography className={classes.commentHeader}>
                {selectedAnnounce.comments.length} Comments
            </Typography>

            {!xsBreakpoint && isLoggedInAdmin ? 
            <Collapse in={commentCollapseOpen} timeout="auto" unmountOnExit>
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
            </Collapse>
            :
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
            }

            {selectedAnnounce.comments.length ? 
                selectedAnnounce.comments.map((comment, i) => {
                    const isCommentOwner = authUser.uid === comment.authorID;
                    return (
                        <Comments 
                            key={i}  
                            comment={comment} 
                            isCommentOwner={isCommentOwner} 
                            {...commentsProps}/> 
                    );
                })
            :
                <Typography>There are currently no comments.</Typography> 
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
            const anchorKey = (payload.id === 'announce') ? 'editAnchor' : 'commentAnchor';
            return { ...state, [anchorKey]: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
        case 'TRIGGER_COLLAPSE':
            return { ...state, commentCollapseOpen: !state.commentCollapseOpen}
        
        case 'CONFIRM_DELETE':
            const confirmKey = (payload.id === 'announce') ? 'editConfirmOpen' : 'commentConfirmOpen';
            return { 
                ...state, 
                [confirmKey]: !state[confirmKey],
                ...(!state[confirmKey]) && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'EDIT_CONTENT':
            const dialogKey = (payload.id === 'announce') ? 'editDialogOpen' : 'commentDialogOpen';
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

        default:
    }
}

export default withFirebase(Announcement);