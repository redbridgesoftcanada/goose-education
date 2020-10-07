import React, { useState, useReducer } from 'react';
import { Box, Button, CardMedia, Collapse, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined, EditOutlined, DeleteOutline } from '@material-ui/icons';
import { ValidatorForm } from 'react-material-ui-form-validator';
import parse from 'html-react-parser';
import { format, compareAsc } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { MuiThemeBreakpoints } from '../constants/constants';
import { withFirebase } from '../components/firebase';
import StyledValidators from '../components/customMUI';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ComposeDialog from '../components/ComposeDialog';
import Comments from '../components/Comments';
import ErrorSnackbar from '../components/ErrorSnackbar';
import { useHistory } from 'react-router-dom';
import useStyles from '../styles/serviceCentre';

const INITIAL_STATE = {
    comment: '',
    commentCollapseOpen: true,
    editAnchor: null,
    editDialogOpen: false,
    editConfirmOpen: false
}

function Article(props) {
    const classes = useStyles();
    const history = useHistory();
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const { article, authUser, firebase } = props;

    const [ error, setError ] = useState(null);
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, commentCollapseOpen, editAnchor, editConfirmOpen, editDialogOpen } = state;
    const editAnchorOpen = Boolean(editAnchor);
    const isArticleOwner = (!authUser) ? false : authUser.uid === article.authorID;

    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS' });
    const handleComment = event => dispatch({ type:'NEW_COMMENT', payload: event.currentTarget.value });
    const handleDeleteConfirmation = event => (event.currentTarget.id) ? dispatch({ type:'CONFIRM_DELETE', payload:event.currentTarget }) : dispatch({ type:'RESET_ACTIONS' });
    const handleEdit = event => dispatch({ type: 'EDIT_CONTENT', payload: event.currentTarget });
    const handleCollapse = () => { dispatch({ type: 'TRIGGER_COLLAPSE' })}
    const resetAllActions = () => dispatch({ type:'RESET_ACTIONS' });
    const handleRedirect = () => history.push({ pathname: '/networking', state: { title: 'Networking', selected: 0 } });
    const handleArticleDelete = () => firebase.deleteArticle(article.id).then(() => handleRedirect());
  
    const onCommentSubmit = event => {
      firebase.article(article.id).update({ 
            "comments": firebase.updateArray().arrayUnion({
                id: uuidv4(),
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }) 
        }).then(() => { 
            resetAllActions();
            handleRedirect();
        }).catch(error => setError(error));
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
            {error && 
                <ErrorSnackbar 
                isOpen={!!error}
                onCloseHandler={() => setError(null)}
                errorMessage={error}/>
            }

            <Typography className={classes.title}>{article.title}</Typography>
            <Grid container className={classes.metaContainer}>
                <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
                    <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{article.authorDisplayName}</Typography>
                    </Grid>

                    <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
                    
                    <Grid item>
                        <Typography className={classes.metaText}>{article.comments.length}</Typography>
                    </Grid>
                    
                    {article.link1 && generateLinks(classes, article.link1)}
                    {article.link2 && generateLinks(classes, article.link2)}
                </Grid>

                <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
                    <Grid item><ScheduleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>
                            {format([article.createdAt, article.updatedAt].sort(compareAsc).pop(), 'P')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* C O N T E N T */}
            <CardMedia
                alt='Article Cover'
                className={classes.articleImage}
                image={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)}/>
            
            {!xsBreakpoint ?
                <>
                    <Box py={3}>{parse(article.description)}</Box>

                    {isArticleOwner &&
                        <Grid container className={classes.announceActions}>
                            <Grid item sm={4}>
                                <Button onClick={handleCollapse} fullWidth className={classes.announceButtons}>
                                    <ChatBubbleOutlineOutlined/>
                                </Button>
                            </Grid>
                            <Grid item sm={4}>
                                <Button id='article' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                                    <EditOutlined/>
                                </Button>
                            </Grid>
                            <Grid item sm={4}>
                                <Button id='article' onClick={handleDeleteConfirmation} fullWidth className={classes.announceButtons}>
                                    <DeleteOutline/>
                                </Button>
                            </Grid>
                        </Grid>
                    }
                </> 
                : 
                <Grid container className={classes.announceContainer}>
                    {!isArticleOwner ? 
                        <Grid item>{parse(article.description)}</Grid>
                        :
                        <>
                            <Grid item xs={9}>{parse(article.description)}</Grid>
                            <Grid item>
                                <IconButton id='article' onClick={openPostActions}>
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
                <MenuItem id='article' onClick={handleEdit}>Edit</MenuItem>
                <MenuItem id='article' onClick={handleDeleteConfirmation}>Delete</MenuItem>
            </Menu>

             <ComposeDialog
                isEdit={true}
                article={article}
                authUser={authUser} 
                composeType='article'
                composeOpen={editDialogOpen} 
                onClose={resetAllActions}/>
            
            <DeleteConfirmation 
                deleteType='article' 
                open={editConfirmOpen} 
                handleDelete={handleArticleDelete} 
                onClose={handleDeleteConfirmation}/>

            <Divider light/>

            <Typography className={classes.commentHeader}>
                {article.comments.length} Comments
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

            {!!article.comments.length &&
                <Comments 
                    formType='article' 
                    authUser={authUser}
                    selectedResource={article}
                    listOfComments={article.comments}/> 
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
            return { ...state, commentCollapseOpen: !state.commentCollapseOpen }
        
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
            return { ...INITIAL_STATE }
        }

        default:
    }
}

export default withFirebase(Article);