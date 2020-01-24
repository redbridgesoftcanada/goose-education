import React, { Fragment, useState } from 'react';
import { Box, Button, Container, Divider, Fab, Grid, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, PrintOutlined } from '@material-ui/icons';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import Typography from '../components/onePirate/Typography';
import { withFirebase } from '../components/firebase';

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

function Announcement(props) {
    const { authUser, classes, firebase, history, selectedAnnounce } = props;
    const [ comment, setComment ] = useState('');

    const onSubmit = event => {
        firebase.announcement(selectedAnnounce.id).update({ 
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
            <Typography variant='body2' align='left' className={classes.description}>
                {selectedAnnounce ? selectedAnnounce.description : ''}
            </Typography>
            <Fab size="small" color="secondary" className={classes.print} onClick={() => printDiv('printableArea')}>
                <PrintOutlined />
            </Fab>
            <br/><br/><br/>
            <Divider light/>
            <Typography variant='body1' align='left' className={classes.description}>
                {selectedAnnounce ? selectedAnnounce.comments.length : ''} Comments
            </Typography>
            {selectedAnnounce.comments.map((comment, i) => {
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
                        <Typography variant='body2' align='left'>{comment.description}</Typography>
                    </Fragment>
                )
            })}
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

export default withStyles(styles)(withFirebase(Announcement));