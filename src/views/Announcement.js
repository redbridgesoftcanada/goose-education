import React, { useReducer } from 'react';
import { Box, Button, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import { format } from 'date-fns';
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
    const { authUser, firebase, selectedAnnounce } = props;
    const classes = useStyles(props, 'announcement');
    const history = useHistory();
    
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


    console.log('comment >> ', comment.length, comment)
    // E V E N T  L I S T E N E R S 
    const redirectPath = () => history.push({ pathname: '/services', state: { title: 'Service Centre', tab: 0 }});
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
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
        .then(() => { redirectPath() });
        // .catch(error => dispatch({ type: 'error', payload: error }))
        event.preventDefault();
    }

    return (
        <Container className={classes.mt3}>
            <Typography className={classes.title}>
                {(selectedAnnounce && selectedAnnounce.title) ? selectedAnnounce.title : 'New Announcement' }
            </Typography>
            <Box px={3} py={2} className={classes.meta}>
                <div className={classes.left}>
                    <Grid container spacing={1}>
                        <Grid item >
                            <AccountCircleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.pr1}>{selectedAnnounce.authorDisplayName ? selectedAnnounce.authorDisplayName : ''}</Typography>
                        </Grid>
                        <Grid item >
                            <ChatBubbleOutlineOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.pr1}>{selectedAnnounce.comments ? selectedAnnounce.comments.length : ''}</Typography>
                        </Grid>
                        <Grid item >
                            <VisibilityOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.pr1}>{selectedAnnounce.views ? selectedAnnounce.views : 0}</Typography>
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

            <Grid container justify='space-between'>
                <Grid item xs={11}>
                    <Typography component='div' variant='body2' align='left' className={classes.mt3}>
                        {parse(selectedAnnounce.description)}
                    </Typography>
                </Grid>

                <Grid item>
                    {(authUser && authUser.roles['admin']) &&
                    <>
                        <IconButton id='announce' onClick={openPostActions}>
                            <MoreVertOutlined/>
                        </IconButton>
                        <Menu
                            keepMounted
                            anchorEl={editAnchor}
                            open={editAnchorOpen}
                            onClose={closePostActions}
                        >
                            <MenuItem id='announce' onClick={handleEdit}>Edit announcement</MenuItem>
                            <MenuItem id='announce' onClick={handleDeleteConfirmation}>Delete announcement</MenuItem>
                        </Menu>

                         {/* E D I T  &  D E L E T E  F E A T U R E */}
                        <ComposeDialog
                            isEdit={true}
                            article={selectedAnnounce}
                            authUser={authUser} 
                            composeType='announce'
                            composeOpen={editDialogOpen} 
                            onClose={resetAllActions} 
                        />
                        <DeleteConfirmation deleteType='admin_announce' open={editConfirmOpen} handleDelete={handleAnnounceDelete} onClose={handleDeleteConfirmation}/>
                    </>
                    }
                </Grid>
            </Grid>

            {selectedAnnounce.link1 && generateLinks(selectedAnnounce.link1)}
            {selectedAnnounce.link2 && generateLinks(selectedAnnounce.link2)} 

            <Divider light/>
            <Typography className={classes.description}>
                {selectedAnnounce ? selectedAnnounce.comments.length : 0} Comments
            </Typography>
            {selectedAnnounce.comments.length ? 
                selectedAnnounce.comments.map((comment, i) => {
                    const isCommentOwner = (!authUser) ? false : authUser.uid === comment.authorID;
                    return (
                        <Comments key={i} 
                            comment={comment} 
                            isCommentOwner={isCommentOwner} 
                            {...commentsProps} /> 
                    );
                })
            :
                <Typography>There are currently no comments.</Typography> 
            }

            <ValidatorForm className={classes.mt3} onSubmit={onSubmit}>
                <StyledValidators.TextField
                    {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}
                    multiline
                    rows={5}
                    value={comment}
                    onChange={handleComment}
                    validators={['isQuillEmpty']}
                    errorMessages={['']}/>
                <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
            </ValidatorForm>
        </Container>
    )
}

function generateLinks(link) {
    const isFacebook = link.includes('facebook');
    const isInstagram = link.includes('instagram');
    const isMaps = link.includes('map');

    return (
        <Grid container spacing={1} onClick={() => window.open(link, "_blank")}>
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
            const anchorKey = (payload.id === 'announce') ? 'editAnchor' : 'commentAnchor';
            return { ...state, [anchorKey]: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
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