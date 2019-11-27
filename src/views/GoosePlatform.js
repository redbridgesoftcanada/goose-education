import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';

const styles = theme => ({
    root: {
        marginTop: theme.spacing(10),
        marginBottom: 0,
        display: 'flex',
    },
    frontWrapper: {
        zIndex: 1,
    },
    frontCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(8, 3),
    },
    backCardContent: {
        color: theme.palette.common.white,
    },
    backCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#bf1f22',
        color: theme.palette.common.white,
        padding: theme.spacing(8, 10),
    },
    backWrapper: {
        position: 'relative',
    },
    behind: {
        position: 'absolute',
        top: -67,
        left: -67,
        right: 0,
        bottom: 0,
        width: '135%',
    },
});

function GoosePlatform(props) {
    const { classes } = props;

    return (
        <Container className={classes.root} component="section">
            <Grid container>
                <Grid item xs={6} md={3} className={classes.frontWrapper}>
                    <div className={classes.frontCard}>
                        <Typography variant="h6" marked="center">
                            Step 01
                        </Typography>
                        <Typography variant="h6">
                            School Choice
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, you have cat to be kitten me right meow or shove bum in owner's face like camera lens go into a room to decide you didn't want to be in there anyway.
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={6} md={3} className={classes.backWrapper}>
                    <div className={classes.behind}>
                        <div className={classes.backCard}>
                            <Typography variant="h6" marked="center" className={classes.backCardContent}>
                                Step 02
                            </Typography>
                            <Typography variant="h6" className={classes.backCardContent}>
                                Homestay
                            </Typography>
                            <Typography variant="body2">
                                Cat ipsum dolor sit amet, you have cat to be kitten me right meow or shove bum in owner's face like camera lens go into a room to decide you didn't want to be in there anyway.
                            </Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} md={3} className={classes.frontWrapper}>
                    <div className={classes.frontCard}>
                        <Typography variant="h6" marked="center">
                            Step 03
                        </Typography>
                        <Typography variant="h6">
                            Airport Ride
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, you have cat to be kitten me right meow or shove bum in owner's face like camera lens go into a room to decide you didn't want to be in there anyway.
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={6} md={3} className={classes.backWrapper}>
                    <div className={classes.behind}>
                        <div className={classes.backCard}>
                            <Typography variant="h6" marked="center" className={classes.backCardContent}>
                                Step 04
                            </Typography>
                            <Typography variant="h6" className={classes.backCardContent}>
                                Networking
                            </Typography>
                            <Typography variant="body2">
                                Cat ipsum dolor sit amet, you have cat to be kitten me right meow or shove bum in owner's face like camera lens go into a room to decide you didn't want to be in there anyway.
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}

GoosePlatform.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GoosePlatform);