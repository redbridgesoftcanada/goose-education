import React, { useReducer } from 'react';
import { Box, Button, Container, Divider, Fab, Grid, IconButton, Menu, MenuItem, Typography, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, PrintOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { EditorValidator } from '../constants/customValidators';
import { withFirebase } from '../components/firebase';
import Comments from '../components/Comments';
import ComposeDialog from '../components/ComposeDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';

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

function Announcement(props) {
    const { authUser, classes, firebase, history, selectedAnnounce } = props;
    
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

    // E V E N T  L I S T E N E R S 
    const redirectPath = () => history.push({ pathname: '/services', state: { title: 'Service Centre', tab: 0 }});
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleAnnounceDelete = () => firebase.deleteArticle(selectedAnnounce.id).then(() => redirectPath());

    const commentsProps = { formType: 'announcement', selectedResource: selectedAnnounce, classes, firebase, commentAnchor, commentAnchorOpen, commentDialogOpen, commentConfirmOpen, openPostActions, closePostActions, handleEdit, handleDeleteConfirmation, resetAllActions }

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
        <Container className={classes.mt3} id='printableArea'>
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
                            <Typography variant='body2' className={classes.pr1}>{selectedAnnounce.authorDisplayName ? selectedAnnounce.authorDisplayName : ''}</Typography>
                        </Grid>
                        <Grid item >
                            <ChatBubbleOutlineOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>{selectedAnnounce.comments ? selectedAnnounce.comments.length : ''}</Typography>
                        </Grid>
                        <Grid item >
                            <VisibilityOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>{selectedAnnounce.views ? selectedAnnounce.views : 0}</Typography>
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
                        <DeleteConfirmation deleteType='announce' open={editConfirmOpen} handleDelete={handleAnnounceDelete} onClose={handleDeleteConfirmation}/>
                    </>
                    }
                </Grid>
            </Grid>

            <Fab size='small' color='secondary' className={classes.print} onClick={() => printDiv('printableArea')}>
                <PrintOutlined />
            </Fab>

            {selectedAnnounce.link1 && generateLinks(classes, selectedAnnounce.link1)}
            {selectedAnnounce.link2 && generateLinks(classes, selectedAnnounce.link2)} 

            <br/><br/><br/>
            <Divider light/>
            <Typography variant='body1' align='left' className={classes.description}>
                {selectedAnnounce ? selectedAnnounce.comments.length : ''} Comments
            </Typography>
            {selectedAnnounce.comments.length ? 
                selectedAnnounce.comments.map((comment, i) => {
                    const isCommentOwner = (!authUser) ? false : authUser.uid === comment.authorID;
                    return <Comments key={i} comment={comment} isCommentOwner={isCommentOwner} {...commentsProps} /> 
                })
            :
                <Typography>There are currently no comments.</Typography> 
            }
            <br/>
            <div>
                <ValidatorForm className={classes.mt3} noValidate autoComplete='off' onSubmit={onSubmit}>
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