import React from 'react';
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
    const { classes, graphics } = props;

    const filteredGraphics = Object.values(graphics).filter(graphic => typeof graphic !== 'string');
    filteredGraphics.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    return (
        <Container className={classes.root} component="section">
            <Grid container>
                {filteredGraphics.map((graphic, i) => {
                    return (
                        <Grid item xs={6} md={3} className={(i % 2 === 0) ? classes.frontWrapper : classes.backWrapper} key={i}>
                            <div {...(i % 2 !== 0) && {className: classes.behind} }>
                                <div className={(i % 2 === 0) ? classes.frontCard : classes.backCard}>
                                    <Typography variant="h6" marked="center" {...(i % 2 !== 0) && {className:classes.backCardContent}}>{graphic.title}</Typography>
                                    <Typography variant="h6" {...(i % 2 !== 0) && {className:classes.backCardContent}}>{graphic.subtitle}</Typography>
                                    <Typography variant="body2">{graphic.caption}</Typography>
                                </div>
                            </div>
                        </Grid>
                )})}
            </Grid>
        </Container>
    );
}

export default withStyles(styles)(GoosePlatform);