import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { MuiThemeBreakpoints } from '../constants/constants';
import useStyles from '../styles/goose';

export default function CoreFeatures(props) {
    const classes = useStyles(props, 'studyAbroad');
    const smBreakpoint = MuiThemeBreakpoints().sm;
    const { graphics } = props;

    return (
        <section className={classes.container}>
            <Typography className={classes.headerTitle}>
                {graphics.title}
            </Typography>
            <Typography className={classes.headerSubtitle}>
                {graphics.subtitle}
            </Typography>
            <Container>
                <Grid container spacing={3}>
                    {!smBreakpoint && <Grid item xs={12} md={2}></Grid>}
                    <Grid item xs={12} md={4}>
                        <img className={classes.image} src={require(`../assets/img/${graphics.GFB1.image}`)}/>
                        <Typography variant="h6">{graphics.GFB1.title}</Typography>
                        <Typography variant="body2">{graphics.GFB1.caption}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img className={classes.image} src={require(`../assets/img/${graphics.GFB2.image}`)}/>
                        <Typography variant="h6">{graphics.GFB2.title}</Typography>
                        <Typography variant="body2">{graphics.GFB2.caption}</Typography>
                    </Grid>
                    {!smBreakpoint && <Grid item xs={12} md={2}></Grid>}
                </Grid>
            </Container>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <img className={classes.image} src={require(`../assets/img/${graphics.GFB3.image}`)}/>
                        <Typography variant="h6">{graphics.GFB3.title}</Typography>
                        <Typography variant="body2">{graphics.GFB3.caption}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img className={classes.image} src={require(`../assets/img/${graphics.GFB4.image}`)}/>
                        <Typography variant="h6">{graphics.GFB4.title}</Typography>
                        <Typography variant="body2">{graphics.GFB4.caption}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <img className={classes.image} src={require(`../assets/img/${graphics.GFB5.image}`)}/>
                        <Typography variant="h6">{graphics.GFB5.title}</Typography>
                        <Typography variant="body2">{graphics.GFB5.caption}</Typography>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}