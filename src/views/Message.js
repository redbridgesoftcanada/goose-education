import React, { Fragment, useState } from 'react';
import { Box, Button, Container, Divider, Grid, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import parse from 'html-react-parser';

import { withFirebase } from '../components/firebase';
import Typography from '../components/onePirate/Typography';

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
        marginTop: theme.spacing(2),
        paddingBottom: theme.spacing(5),
      },
});

function Message(props) {
    const { authUser, classes, firebase, history, selectedMessage } = props;
    const [ comment, setComment ] = useState('');

    const onSubmit = event => {
        firebase.message(selectedMessage.id).update({ 
            "comments": firebase.updateArray().arrayUnion({
                authorDisplayName: authUser.displayName,
                authorID: authUser.uid,
                description: comment,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }) 
        })
        .then(() => { 
            setComment('');
            history.push('/services') 
        })
        // .catch(error => dispatch({ type: 'error', payload: error }))
        event.preventDefault();
    }

    return (
        <Container className={classes.root}>
            <Typography variant='h6' align='left'>
                {(selectedMessage && selectedMessage.title) ? selectedMessage.title : 'New Message' }
            </Typography>
            <Box px={3} py={2} className={classes.meta}>
                <div className={classes.left}>
                    <Grid container spacing={1}>
                    <Grid item >
                        <AccountCircleOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className={classes.item}>{selectedMessage && selectedMessage.authorDisplayName ? selectedMessage.authorDisplayName : 'Goose User'}</Typography>
                    </Grid>
                    <Grid item >
                        <ChatBubbleOutlineOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className={classes.item}>{selectedMessage && selectedMessage.comments ? selectedMessage.comments.length : 0 }</Typography>
                    </Grid>
                    <Grid item >
                        <VisibilityOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className={classes.item}>{selectedMessage && selectedMessage.views ? selectedMessage.views : 0 }</Typography>
                    </Grid>
                    </Grid>
                </div>
                <div className={classes.right}>
                    <Grid container spacing={1}>
                    <Grid item>
                        <ScheduleOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>{(selectedMessage && selectedMessage.updatedAt > selectedMessage.createdAt) ? format(selectedMessage.updatedAt, 'Pp') : format(selectedMessage.createdAt, 'Pp')}</Typography>
                    </Grid>
                    </Grid>
                </div>
            </Box>
            <Typography variant='body2' align='left' className={classes.description}>
                {selectedMessage ? selectedMessage.description : ''}
            </Typography>
            <Divider light/>
            <Typography variant='body1' align='left' className={classes.description}>
                {selectedMessage ? selectedMessage.comments.length : ''} Comments
            </Typography>
            {selectedMessage && selectedMessage.comments.length ? selectedMessage.comments.map((comment, i) => {
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
                        <Typography variant='body2' align='left'>{parse(comment.description)}</Typography>
                    </Fragment>
                )
            })
            : <Typography>There are currently no comments.</Typography> }
            <br/>
            <div>
                <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
                    <ReactQuill 
                    {...(!authUser ? {readOnly: true, placeholder:'Please Register or Login to Comment.'} : {} )}
                    value={comment} 
                    onChange={value => setComment(value)} />
                    <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
                </form>
            </div>
        </Container>
    )
}

export default withStyles(styles)(withFirebase(Message));