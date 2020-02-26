import React, { Fragment, useReducer } from 'react';
import { Box, Button, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, LocalOfferOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, MoreVertOutlined, LanguageOutlined } from '@material-ui/icons';
import { useRouteMatch } from "react-router-dom";
import { ValidatorForm } from 'react-material-ui-form-validator';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { withFirebase } from '../components/firebase';
import { EditorValidator } from '../constants/customValidators';
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

function Article(props) {
    const { authUser, classes, firebase, history, article } = props;

    const INITIAL_STATE = {
        comment: '',
        anchorEl: null,
        confirmOpen: false,
        dialogOpen: false
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { comment, anchorEl, confirmOpen, dialogOpen } = state;
    const anchorOpen = Boolean(anchorEl);
    
    const match = useRouteMatch();
    const openPostActions = event => dispatch({ type:'OPEN_ACTIONS', payload:event.currentTarget});
    const closePostActions = () => dispatch({ type:'CLOSE_ACTIONS', payload:null });
    const handleComment = value => dispatch({ type:'NEW_COMMENT', payload:value });
    const handleConfirmation = () => dispatch({ type:'CONFIRM_ACTIONS' });
    const handleEdit = () => dispatch({ type: 'NEW_EDIT' });
    const handleDelete = () => firebase.deleteArticle(article.id).then(() => history.push('/networking'));

    let isArticleOwner;
    if (!article) {
      return null;
    } else {
      isArticleOwner = (authUser.uid === article.authorID);
    }
  
    const onSubmit = event => {
      firebase.article(article.id).update({ 
        "comments": firebase.updateArray().arrayUnion({
            authorDisplayName: authUser.displayName,
            authorID: authUser.uid,
            description: comment,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }) 
      }).then(() => { 
        handleComment('');
        history.push('/networking');
      });
      // .catch(error => dispatch({ type: 'error', payload: error }))
      event.preventDefault();
    }

    return (
        <Container className={classes.mt3}>
            <Typography variant='h6' align='left'>{article.title}</Typography>

            {/* METADATA: [author, tag, number of comments, number of views, date created/updated] */}
            <Box px={3} pt={2} pb={4} className={classes.meta}>
                <Box className={classes.left}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <AccountCircleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.authorDisplayName}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <LocalOfferOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.tag}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <ChatBubbleOutlineOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.comments.length}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <VisibilityOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2' className={classes.pr1}>
                                {article.views}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box className={classes.right}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <ScheduleOutlined/>
                        </Grid>
                        <Grid item>
                            <Typography variant='body2'>
                                {article.createdAt && article.updatedAt ? format(article.updatedAt, 'Pp') : format(article.createdAt, 'Pp')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* CONTENT */}
            <img className={classes.image} src={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)} alt="article cover"/>
            
            <Grid container justify='space-between'>
                <Grid item xs={11}>
                    <Typography component='span' variant='body2' align='left' className={classes.mt3}>
                        {parse(article.description)}
                    </Typography>
                </Grid>

                <Grid item>
                    {isArticleOwner &&
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
                            <MenuItem onClick={handleEdit}>Edit article</MenuItem>
                            <MenuItem onClick={handleConfirmation}>Delete article</MenuItem>
                        </Menu>
                    </>
                    }
                </Grid>
            </Grid>

            {/* EDIT & DELETE FEATURE FOR ARTICLE OWNER */}
            <ComposeDialog
                isEdit={true}
                article={article}
                authUser={authUser} 
                composeType='article'
                composeOpen={dialogOpen} 
                onClose={handleEdit} 
            />
            <DeleteConfirmation deleteType='article' open={confirmOpen} handleDelete={handleDelete} onClose={handleConfirmation}/>

            {article.link1 &&
                <Grid container spacing={1}>
                    <Grid item>
                        <LanguageOutlined fontSize='small'/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>{article.link1}</Typography>
                    </Grid>
                </Grid>
            }

            {article.link2 &&
                <Grid container spacing={1}>
                    <Grid item>
                        <LanguageOutlined fontSize='small'/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>{article.link2}</Typography>
                    </Grid>
                </Grid>
            } 

            <Divider light/>

            {/* COMMENTS */}
            <Typography variant='body1' align='left' className={classes.description}>
                {article.comments.length} Comments
            </Typography>
            
            {article.comments.length ? 
                article.comments.map((comment, i) => {
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
                            <Typography component='span' variant='body2' align='left'>{parse(comment.description)}</Typography>
                        </Fragment>
                )})
                : 
                <Typography>There are currently no comments.</Typography> 
            }
            <br/>
            <ValidatorForm className={classes.mt3} noValidate autoComplete="off" onSubmit={onSubmit}>
                <EditorValidator 
                value={comment} 
                onChange={handleComment}
                validators={['isNotHTML']}
                errorMessages={['Cannot submit an empty comment.']}
                {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}/>
                <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
            </ValidatorForm>
        </Container>
    )
}

export default withStyles(styles)(withFirebase(Article));