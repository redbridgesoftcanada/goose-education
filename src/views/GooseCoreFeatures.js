import React from 'react';
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
    const { classes, graphics } = props;

    return (
        <section className={classes.root}>
            <Typography variant="h4">
                {graphics.title}
            </Typography>
            <Typography variant="body1">
                {graphics.subtitle}
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
                        <Typography variant="h6">{graphics.GFB1.title}</Typography>
                        <Typography variant="body2">{graphics.GFB1.caption}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_02.png")}
                            alt="credit card icon"
                        />
                        <Typography variant="h6">{graphics.GFB2.title}</Typography>
                        <Typography variant="body2">{graphics.GFB2.caption}</Typography>
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
                        <Typography variant="h6">{graphics.GFB3.title}</Typography>
                        <Typography variant="body2">{graphics.GFB3.caption}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_04.png")}
                            alt="computer icon"
                        />
                        <Typography variant="h6">{graphics.GFB4.title}</Typography>
                        <Typography variant="body2">{graphics.GFB4.caption}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img
                            className={classes.image}
                            src={require("../assets/img/mm01_05.png")}
                            alt="networking icon"
                        />
                        <Typography variant="h6">{graphics.GFB5.title}</Typography>
                        <Typography variant="body2">{graphics.GFB5.caption}</Typography>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}

export default withStyles(styles)(ProductValues);