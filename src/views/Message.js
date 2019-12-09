import React from 'react';
import { Box, Container, Divider, Grid, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined } from '@material-ui/icons';

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

function Announcement(props) {
    const { classes, selectedMessage } = props;

    return (
        <Container className={classes.root}>
            <Typography variant='h6' align='left'>
                {(selectedMessage && selectedMessage.title) ? selectedMessage.title : 'New Announcement' }
            </Typography>
            <Box px={3} py={2} className={classes.meta}>
                <div className={classes.left}>
                    <Grid container spacing={1}>
                    <Grid item >
                        <AccountCircleOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className={classes.item}>{selectedMessage.author ? selectedMessage.author : ''}</Typography>
                    </Grid>
                    <Grid item >
                        <ChatBubbleOutlineOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className={classes.item}>{selectedMessage.comments ? selectedMessage.comments.length : ''}</Typography>
                    </Grid>
                    <Grid item >
                        <VisibilityOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className={classes.item}>{selectedMessage.views ? selectedMessage.views : ''}</Typography>
                    </Grid>
                    </Grid>
                </div>
                <div className={classes.right}>
                    <Grid container spacing={1}>
                    <Grid item>
                        <ScheduleOutlined/>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>{selectedMessage ? selectedMessage.date : ''}</Typography>
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
        </Container>
    )
}

export default withStyles(styles)(Announcement);