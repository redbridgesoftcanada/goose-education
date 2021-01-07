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

function Services({ firebase, serviceType }) {
  const authUser = useContext(AuthUserContext);
  const { dispatch, setNotification } = useContext(DispatchContext);
  const stateContext = useContext(StateContext);

  const contentSelect = stateContext[serviceType];  // 'announceSelect' or 'messageSelect';
  const { 
    commentCollapseOpen, 
    editAnchor, 
    editDialogOpen, 
    deleteConfirmOpen
  } = stateContext;

  const { userRole, collection, ref } = configurePermissions(serviceType, authUser, contentSelect);

  const toggleComment = () => dispatch({ type: 'commentToggle' });

  const toggleUserActions = event => event.currentTarget.id ? 
    dispatch({ type:'userActionsToggle', payload: event.currentTarget }) : 
    dispatch({ type:'userActionsToggle', payload: null });

  const handleDeleteConfirm = event => event.currentTarget.id ? 
    dispatch({ type:'deleteConfirmToggle', payload:event.currentTarget }) : 
    dispatch({ type:'userActionsReset' });
  
  const handleEdit = event => dispatch({ type: 'editToggle', payload: event.currentTarget });
  
  const handleContentDelete = async () => {
    const docRef = { id: contentSelect.id, upload: null }
    try {
      await checkStorageDelete(firebase, collection, docRef);
      resetAllActions('success', 'Successfully deleted!');
    } catch (err) {
      resetAllActions('error', 'Unable to be deleted. We will try and fix this issue.');
    }
  }

  const resetAllActions = (action, message) => {
    history.push({ pathname: '/services', state: { tab: 0 }});
    dispatch({ type:'userActionsReset' });
    setNotification({ action, message });
  }
  
  const classes = useStyles({});
  const history = useHistory();
  const xsBreakpoint = MuiThemeBreakpoints().xs;
  
  return (
    <Container>
      <Typography className={classes.title}>{contentSelect.title}</Typography>

      <Grid container className={classes.metaContainer}>
        <Grid container item xs={7} sm={6} spacing={1} className={classes.metaLeft}>
          <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
          <Grid item>
            <Typography className={classes.metaText}>{contentSelect.authorDisplayName}</Typography>
          </Grid>

          <Grid item><ChatBubbleOutlineOutlined fontSize='small'/></Grid>
          <Grid item>
            <Typography className={classes.metaText}>{contentSelect.comments.length}</Typography>
          </Grid>
          
          {contentSelect.link1 && generateLinks(classes, contentSelect.link1)}
          {contentSelect.link2 && generateLinks(classes, contentSelect.link2)}
        </Grid>

        <Grid container item xs={5} sm={6} spacing={1} className={classes.metaRight}>
          <Grid item><ScheduleOutlined fontSize='small'/></Grid>
          <Grid item>
            <Typography className={classes.metaText}>
              {format([contentSelect.createdAt, contentSelect.updatedAt].sort(compareAsc).pop(), 'P')}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {!xsBreakpoint ?
        <>
          <Box py={3}>{parse(contentSelect.description)}</Box>
          {/* [Button Bar] User Actions: Accessible by admin/content creator */}
          {userRole &&
            <Grid container className={classes.announceActions}>
              <Grid item sm={4}>
                <Button onClick={toggleComment} fullWidth className={classes.announceButtons}>
                  <ChatBubbleOutlineOutlined/>
                </Button>
              </Grid>
              <Grid item sm={4}>
                <Button id='editButton' onClick={handleEdit} fullWidth className={classes.announceButtons}>
                  <EditOutlined/>
                </Button>
              </Grid>
              <Grid item sm={4}>
                <Button id='deleteButton' onClick={handleDeleteConfirm} fullWidth className={classes.announceButtons}>
                  <DeleteOutline/>
                </Button>
              </Grid>
            </Grid>
          }
        </> 
        : 
        <Grid container className={classes.announceContainer}>
          <Grid item {...userRole && { xs: 10 }}>{parse(contentSelect.description)}</Grid>
          {/* [Button Menu] User Actions: Accessible by admin/content creator */}
          {userRole &&
            <Grid item>
              <IconButton id='userActions' onClick={toggleUserActions}>
                <MoreVertOutlined/>
              </IconButton>
            </Grid>
          }
        </Grid>
      }

      <Divider light/>

      <Typography className={classes.commentHeader}>
        {contentSelect.comments.length} Comments
      </Typography>

      {!xsBreakpoint && userRole ? 
        <Collapse in={commentCollapseOpen} timeout="auto" unmountOnExit>
          <CommentField/>
        </Collapse>
        :
        <CommentField/>
      }

      {contentSelect.comments.length ?
        <Comments 
          formType={collection} 
          formKey={serviceType}
          resetAllActions={resetAllActions}/> 
        : null
      }

      <Menu
        keepMounted
        anchorEl={editAnchor}
        open={Boolean(editAnchor)}
        onClose={toggleUserActions}>
          <MenuItem id='editMenu' onClick={handleEdit}>Edit</MenuItem>
          <MenuItem id='deleteMenu' onClick={handleDeleteConfirm}>Delete</MenuItem>
      </Menu>

      <ComposeDialog
        isEdit={true}
        article={contentSelect}
        composeType={ref}
        composeOpen={editDialogOpen} 
        onClose={resetAllActions}/>
      
      <DeleteConfirmation 
        deleteType={ref} 
        open={deleteConfirmOpen} 
        handleDelete={handleContentDelete} 
        onClose={handleDeleteConfirm}/>

    </Container>
  )
}

function configurePermissions(serviceType, authUser, contentSelect) {
  let permissions = {};
  
  if (serviceType === 'announceSelect') {
    permissions = {
      userRole: authUser && authUser.roles['admin'],
      collection: 'announcements',
      ref: 'announce'
    }
  } else if (serviceType === 'messageSelect') {
    permissions = {
      userRole: authUser.uid === contentSelect.authorID,
      collection: 'messages',
      ref: 'message'
    }
  } else {
    console.log(`Missing serviceType (logged: ${serviceType}) to configure permissions for selected content (/services).`);
    return;
  }
  return permissions;
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

export default withFirebase(Services);