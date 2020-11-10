import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, CardMedia, Collapse, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined, EditOutlined, DeleteOutline } from '@material-ui/icons';
import { ValidatorForm } from 'react-material-ui-form-validator';
import parse from 'html-react-parser';
import { format, compareAsc } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { MuiThemeBreakpoints } from '../constants/constants';
import { checkStorageDelete } from '../constants/helpers/_storage';
import { AuthUserContext } from '../components/session';
import { StateContext, DispatchContext } from '../components/userActions';
import { withFirebase } from '../components/firebase';
import StyledValidators from '../components/customMUI';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ComposeDialog from '../components/ComposeDialog';
import Comments from '../components/Comments';
import ErrorSnackbar from '../components/ErrorSnackbar';
import useStyles from '../styles/serviceCentre';

function Article({ firebase }) {
    const authUser = useContext(AuthUserContext);
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    
    const [ comment, setComment ] = useState('');
    const [ error, setError ] = useState(null);
    const { 
        articleSelect,
        commentCollapseOpen, 
        editAnchor, 
        editDialogOpen, 
        deleteConfirmOpen
    } = state;

    const isArticleOwner = !authUser ? false : authUser.uid === articleSelect.authorID;

    const toggleComment = () => dispatch({ type: 'commentToggle' });

    const toggleUserActions = event => event.currentTarget.id ? 
        dispatch({ type:'userActionsToggle', payload: event.currentTarget }) : 
        dispatch({ type:'userActionsToggle', payload: null });

    const handleDeleteConfirm = event => event.currentTarget.id ? 
        dispatch({ type:'deleteConfirmToggle', payload:event.currentTarget }) : 
        dispatch({ type:'userActionsReset' });
    
    const handleEdit = event => dispatch({ type: 'editToggle', payload: event.currentTarget });

    const pageRedirect = () => history.push({ 
        pathname: '/networking', 
        state: { selected: 0 } 
    });

    const resetAllActions = () => {
        dispatch({ type:'userActionsReset' });
        pageRedirect();
    }
    
    const handleArticleDelete = async () => {
        const docRef = { id: articleSelect.id, upload: articleSelect.image }
        await checkStorageDelete(firebase, 'articles', docRef);
        pageRedirect();
    }
  
    const onCommentSubmit = event => {
      firebase.article(articleSelect.id).update({ 
            "comments": firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }) 
        }).then(() => { 
            dispatch({ type:'userActionsReset' });
            pageRedirect();
        }).catch(error => setError(error));
      event.preventDefault();
    }

    const history = useHistory();
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const classes = useStyles();

    const CommentFormField = 
        <ValidatorForm onSubmit={onCommentSubmit}>
            <StyledValidators.TextField
                onChange={event => setComment(event.target.value)}
                multiline
                rows={5}
                value={comment}
                validators={['isQuillEmpty']}
                errorMessages={['']}/>
            <Button className={classes.commentButton} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
        </ValidatorForm>

    return (
        <Container>
            {error && 
                <ErrorSnackbar 
                isOpen={!!error}
                onCloseHandler={() => setError(null)}
                errorMessage={error}/>
            }

            <Typography className={classes.title}>{articleSelect.title}</Typography>
            <Grid container className={classes.metaContainer}>
                <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
                    <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{articleSelect.authorDisplayName}</Typography>
                    </Grid>

                    <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
                    
                    <Grid item>
                        <Typography className={classes.metaText}>{articleSelect.comments.length}</Typography>
                    </Grid>
                    
                    {articleSelect.link1 && generateLinks(classes, articleSelect.link1)}
                    {articleSelect.link2 && generateLinks(classes, articleSelect.link2)}
                </Grid>

                <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
                    <Grid item><ScheduleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>
                            {format([articleSelect.createdAt, articleSelect.updatedAt].sort(compareAsc).pop(), 'P')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* C O N T E N T */}
            <CardMedia
                alt='Article Cover'
                className={classes.articleImage}
                image={articleSelect.image}/>
            
            {!xsBreakpoint ?
                <>
                    <Box py={3}>{parse(articleSelect.description)}</Box>

                    {isArticleOwner &&
                        <Grid container className={classes.announceActions}>
                            <Grid item sm={4}>
                                <Button onClick={toggleComment} fullWidth className={classes.announceButtons}>
                                    <ChatBubbleOutlineOutlined/>
                                </Button>
                            </Grid>
                            <Grid item sm={4}>
                                <Button id='article' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                                    <EditOutlined/>
                                </Button>
                            </Grid>
                            <Grid item sm={4}>
                                <Button id='article' onClick={handleDeleteConfirm} fullWidth className={classes.announceButtons}>
                                    <DeleteOutline/>
                                </Button>
                            </Grid>
                        </Grid>
                    }
                </> 
                : 
                <Grid container className={classes.announceContainer}>
                    {!isArticleOwner ? 
                        <Grid item>{parse(articleSelect.description)}</Grid>
                        :
                        <>
                            <Grid item xs={9}>{parse(articleSelect.description)}</Grid>
                            <Grid item>
                                <IconButton id='article' onClick={toggleUserActions}>
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
                open={Boolean(editAnchor)}
                onClose={toggleUserActions}>
                <MenuItem id='article' onClick={handleEdit}>Edit</MenuItem>
                <MenuItem id='article' onClick={handleDeleteConfirm}>Delete</MenuItem>
            </Menu>

             <ComposeDialog
                isEdit={true}
                article={articleSelect}
                authUser={authUser} 
                composeType='article'
                composeOpen={editDialogOpen} 
                onClose={resetAllActions}/>
            
            <DeleteConfirmation 
                deleteType='article' 
                open={deleteConfirmOpen} 
                handleDelete={handleArticleDelete} 
                onClose={handleDeleteConfirm}/>

            <Divider light/>

            <Typography className={classes.commentHeader}>
                {articleSelect.comments.length} Comments
            </Typography>

            {
                !authUser ? 
                <Typography>Please login/register to post comments.</Typography>
                :
                !xsBreakpoint && isArticleOwner ? 
                <Collapse in={commentCollapseOpen} timeout="auto" unmountOnExit>
                    {CommentFormField}
                </Collapse>
                :
                CommentFormField
            }

            {!!articleSelect.comments.length &&
                <Comments 
                    formType='article' 
                    authUser={authUser}
                    selectedResource={articleSelect}
                    listOfComments={articleSelect.comments}/> 
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

export default withFirebase(Article);