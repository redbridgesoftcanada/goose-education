import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(15),
        display: 'flex',
        position: 'relative',
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
});

function ProductValues(props) {
    const { classes } = props;

    return (
        <section className={classes.root}>
            <Typography variant="h4">
                Distinction
            </Typography>
            <Typography variant="body1">
                Goose Education Key Features
            </Typography>
            <Container className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={2}></Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_01.png")}
                            alt="notification icon"
                        />
                        <Typography variant="h6">
                            Notification Service
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, chase imaginary bugs, but i am the best. This human feeds me, i should be a god stick butt in face.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_02.png")}
                            alt="credit card icon"
                        />
                        <Typography variant="h6">
                            Various Payment Methods
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, chase imaginary bugs, but i am the best. This human feeds me, i should be a god stick butt in face.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}></Grid>
                </Grid>
            </Container>
            <Container className={classes.container}>
            <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_03.png")}
                            alt="calendar icon"
                        />
                        <Typography variant="h6">
                            Accurate Latest News
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, chase imaginary bugs, but i am the best. This human feeds me, i should be a god stick butt in face.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_04.png")}
                            alt="computer icon"
                        />
                        <Typography variant="h6">
                            Study Abroad for Yourself
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, chase imaginary bugs, but i am the best. This human feeds me, i should be a god stick butt in face.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_05.png")}
                            alt="networking icon"
                        />
                        <Typography variant="h6">
                            Networking
                        </Typography>
                        <Typography variant="body2">
                            Cat ipsum dolor sit amet, chase imaginary bugs, but i am the best. This human feeds me, i should be a god stick butt in face.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}

ProductValues.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);