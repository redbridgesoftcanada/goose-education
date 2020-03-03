import React, { useReducer } from 'react';
import { Box, Button, Container, Divider, Fab, Grid, Typography, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, PrintOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { EditorValidator } from '../constants/customValidators';
import { withFirebase } from '../components/firebase';
import Comments from '../components/Comments';

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
            const anchorKey = (payload.id === 'announcement') ? 'editAnchor' : 'commentAnchor';
            return { ...state, [anchorKey]: payload }

        case 'CLOSE_ACTIONS':
            return { ...state, editAnchor: null, commentAnchor: null }
        
        case 'CONFIRM_DELETE':
            const confirmKey = (payload.id === 'announcement') ? 'editConfirmOpen' : 'commentConfirmOpen';
            return { 
                ...state, 
                [confirmKey]: !state[confirmKey],
                ...(!state[confirmKey]) && { editAnchor: null, commentAnchor: null }   // synchronize closing the EDIT/DELETE menu in the background
            }
        
        case 'EDIT_CONTENT':
            const dialogKey = (payload.id === 'announcement') ? 'editDialogOpen' : 'commentDialogOpen';
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

    const redirectPath = () => history.push({ pathname: '/services', state: { title: 'Service Centre', selected: 0 }});
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => (event.currentTarget.id) ? dispatch({ type: 'EDIT_CONTENT', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });

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
            {selectedAnnounce.comments.length ? 
                selectedAnnounce.comments.map((comment, i) => {
                    let isCommentOwner = authUser.uid === comment.authorID;
                    return (
                        <Comments i={i} classes={classes} comment={comment} isCommentOwner={isCommentOwner} firebase={firebase} formType={'announcement'} openPostActions={openPostActions} closePostActions={closePostActions} commentAnchor={commentAnchor} commentAnchorOpen={commentAnchorOpen} commentDialogOpen={commentDialogOpen} commentConfirmOpen={commentConfirmOpen} selectedResource={selectedAnnounce} handleEdit={handleEdit} handleDeleteConfirmation={handleDeleteConfirmation} resetAllActions={resetAllActions} /> 
                )})
            :
                <Typography>There are currently no comments.</Typography> 
            }
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