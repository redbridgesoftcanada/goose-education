import React from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    background: {
        color: theme.palette.common.white,
        backgroundColor: '#bf1f22',
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '25%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3, 5),
        textAlign: 'left'
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    titleWhite: {
        color: theme.palette.common.white,
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3, 2),
    },
    button: {
        marginTop: '1.5em'
    },
    buttonWhite: {
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
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <div className={classes.header}>
                        <Typography variant="h4" className={classes.title}>
                            School Information
                        </Typography>
                        <IconButton aria-label="settings" className={classes.button}>
                            <AddIcon />
                        </IconButton>
                    </div>
                    <Grid item xs={12} md={12} className={classes.container}>
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/643318286_1fRTZOz6_dc1f626815427c94079076f6c9e8b8047d70a753.jpg")}
                                alt="iTTTi logo"
                            />
                            <div className={classes.description}>
                                <Typography variant="subtitle1">
                                    iTTTi
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                                <Typography variant="body2">
                                    2019-03-20
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/643318286_rWCPoe2b_b73c26645a2423027ce454bad53c626ba551d40f.png")}
                                alt="Canadian College logo"
                            />
                            <div className={classes.description}>
                                <Typography variant="subtitle1">
                                    Canadian College
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                                <Typography variant="body2">
                                    2019-03-19
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/643318286_pnTMAq4w_54ae6ae567fab4ace2b71e9a84c87a004246b72c.jpg")}
                                alt="Canadian College of English Language logo"
                            />
                            <div className={classes.description}>
                                <Typography variant="subtitle1">
                                    Canadian College of English Language: CCEL
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                                <Typography variant="body2">
                                    2019-03-16
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} className={classes.background}>
                <div className={classes.header}>
                        <Typography variant="h4" className={classes.titleWhite}>
                            Goose Tips
                        </Typography>
                        <IconButton aria-label="settings" className={classes.buttonWhite}>
                            <AddIcon />
                        </IconButton>
                    </div>
                    <Grid item xs={12} md={12} className={classes.container} >
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/6_copy_14_2_copy_6_1_copy_2_2948936627_zlcboNC3_e1e0cdafaaf268f678768639069a77d6921aba1e.jpg")}
                                alt="article-thumbnail"
                            />
                            <div className={classes.description}>
                                <Typography variant="subtitle1">
                                    [Goose Tips] Post Title
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                                <Typography variant="body2">
                                    2018-12-31
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </section>
    );
}

ProductValues.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);