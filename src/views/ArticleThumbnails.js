import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    root: {
        // display: 'flex',
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.dark,
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
        color: theme.palette.common.white,
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    description: {
        color: theme.palette.common.white,
    },
    button: {
        color: theme.palette.common.white,
        marginTop: '1.5em'
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
    }
});

function ProductValues(props) {
    const { classes } = props;

    return (
        <section className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h4" className={classes.title}>
                    Networking
                </Typography>
                <IconButton aria-label="settings" className={classes.button}>
                    <AddIcon />
                </IconButton>
            </div>
            <Typography variant="body2" className={classes.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Container className={classes.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <div>
                            <img
                                className={classes.image}
                                src={require("../assets/img/thumb-2919655616_Y4WrbPxp_61cb5518540dad6db53cd54c36ec8e933ca690f7_283x288.jpg")}
                                alt="article-thumbnail"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/thumb-2919655616_CBAr7uG6_6b5db15acd1fde70c69c532cf137351e2468feb1_283x288.jpg")}
                            alt="article-thumbnail"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/thumb-643318286_ydhXINOi_408f5fdb2cf23cfa89626254c8bf675a784b19cc_283x288.jpg")}
                            alt="article-thumbnail"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/thumb-643318286_VJOTHgMi_d12784f59d57b78a947c1584875ada7ecdcf3c5c_283x288.jpg")}
                            alt="article-thumbnail"
                        /></Grid>
                </Grid>
            </Container>
        </section>
    );
}

ProductValues.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);