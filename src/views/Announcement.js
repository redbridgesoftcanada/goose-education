import React, { useContext } from 'react';
import { Box, Button, Collapse, Container, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, ScheduleOutlined, MoreVertOutlined, Facebook, Instagram, RoomOutlined, LanguageOutlined, EditOutlined, DeleteOutline } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import { format, compareAsc } from 'date-fns';
import parse from 'html-react-parser';
import { MuiThemeBreakpoints } from '../constants/constants';
import { checkStorageDelete } from '../constants/helpers/_storage';
import { AuthUserContext } from '../components/session';
import { StateContext, DispatchContext } from '../components/userActions';
import Comments, { CommentField } from '../components/Comments';
import { withFirebase } from '../components/firebase';
import ComposeDialog from '../components/ComposeDialog';
import DeleteConfirmation from '../components/DeleteConfirmation';
import useStyles from '../styles/serviceCentre.js';

function Announcement({ firebase }) {
    const authUser = useContext(AuthUserContext);
    const stateContext = useContext(StateContext);
    const { dispatch, setNotification } = useContext(DispatchContext);

    const { 
        announceSelect,
        commentCollapseOpen, 
        editAnchor, 
        editDialogOpen, 
        deleteConfirmOpen
    } = stateContext;

    const isAdminRole = authUser && authUser.roles['admin'];

    const toggleComment = () => dispatch({ type: 'commentToggle' });

    const toggleUserActions = event => event.currentTarget.id ? 
        dispatch({ type:'userActionsToggle', payload: event.currentTarget }) : 
        dispatch({ type:'userActionsToggle', payload: null });

    const handleDeleteConfirm = event => event.currentTarget.id ? 
        dispatch({ type:'deleteConfirmToggle', payload:event.currentTarget }) : 
        dispatch({ type:'userActionsReset' });
    
    const handleEdit = event => dispatch({ type: 'editToggle', payload: event.currentTarget });

    const resetAllActions = (action, message) => {
        history.push({ pathname: '/services', state: { tab: 0 }});
        dispatch({ type:'userActionsReset' });
        setNotification({ action, message });
    }
    
    const handleAnnounceDelete = async () => {
        const docRef = { id: announceSelect.id, upload: null }
        try {
            await checkStorageDelete(firebase, 'announcements', docRef);
            resetAllActions('success', 'Announcement has been deleted.');
        } catch (err) {
            resetAllActions('error', 'Announcement could not be deleted. We will try and fix this issue.');
        }
    }
    
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const classes = useStyles({});
    const history = useHistory();
    
    return (
        <Container>
            <Typography className={classes.title}>{announceSelect.title}</Typography>

            <Grid container className={classes.metaContainer}>
                <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
                    <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{announceSelect.authorDisplayName}</Typography>
                    </Grid>

                    <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>{announceSelect.comments.length}</Typography>
                    </Grid>
                    
                    {announceSelect.link1 && generateLinks(classes, announceSelect.link1)}
                    {announceSelect.link2 && generateLinks(classes, announceSelect.link2)}
                </Grid>

                <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
                    <Grid item><ScheduleOutlined fontSize='small'/></Grid>
                    <Grid item>
                        <Typography className={classes.metaText}>
                            {format([announceSelect.createdAt, announceSelect.updatedAt].sort(compareAsc).pop(), 'P')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {!xsBreakpoint ?
            <>
                <Box py={3}>{parse(announceSelect.description)}</Box>

                {isAdminRole &&
                    <Grid container className={classes.announceActions}>
                        <Grid item sm={4}>
                            <Button onClick={toggleComment} fullWidth className={classes.announceButtons}>
                                <ChatBubbleOutlineOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='announce' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                                <EditOutlined/>
                            </Button>
                        </Grid>
                        <Grid item sm={4}>
                            <Button id='announce' onClick={handleDeleteConfirm} fullWidth className={classes.announceButtons}>
                                <DeleteOutline/>
                            </Button>
                        </Grid>
                    </Grid>
                }
            </> 
            : 
            <Grid container className={classes.announceContainer}>
                {!isAdminRole ? 
                    <Grid item>{parse(announceSelect.description)}</Grid>
                :
                <>
                    <Grid item xs={9}>{parse(announceSelect.description)}</Grid>
                    <Grid item>
                        <IconButton id='announce' onClick={toggleUserActions}>
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
                    <MenuItem id='announce' onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem id='announce' onClick={handleDeleteConfirm}>Delete</MenuItem>
            </Menu>

            <ComposeDialog
                isEdit={true}
                article={announceSelect}
                authUser={authUser} 
                composeType='announce'
                composeOpen={editDialogOpen} 
                onClose={resetAllActions}/>
            
            <DeleteConfirmation 
                deleteType='admin_announce' 
                open={deleteConfirmOpen} 
                handleDelete={handleAnnounceDelete} 
                onClose={handleDeleteConfirm}/>

            <Divider light/>

            <Typography className={classes.commentHeader}>
                {announceSelect.comments.length} Comments
            </Typography>

            {
                !authUser ? 
                <Typography>Please login/register to post comments.</Typography>
                :
                !xsBreakpoint && isAdminRole ? 
                    <Collapse in={commentCollapseOpen} timeout="auto" unmountOnExit>
                        <CommentField/>
                    </Collapse>
                :
                <CommentField/>
            }

            {announceSelect.comments.length ?
                <Comments 
                    formType='announcement' 
                    formKey='announceSelect'
                    resetAllActions={resetAllActions}/> 
                : 
                null
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

export default withFirebase(Announcement);