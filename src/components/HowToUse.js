import React from 'react';
import { Container, Grid, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    wrapper: {
        display: 'flex',
    },
    number: {
        marginRight: theme.spacing(1),
    },
});

function HowToUse(props) {
    const { classes, body } = props;
    const circledIndexes = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
    const listOfText = body.caption.split('\n');

  return (
    <Container className={classes.root}>
        <Grid container alignContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
                <Typography color="secondary" variant="h4">{body.title}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                {listOfText.map((text, i) => {
                    return (
                        <div className={classes.wrapper} key={i}>
                            <Typography color="secondary" variant="body1" className={classes.number}>{circledIndexes[i]}</Typography>
                            <Typography align="left" variant="body1">{text}</Typography>
                        </div>
                    )
                })}
            </Grid>
        </Grid>
    </Container>
  );
}

export default withStyles(styles)(HowToUse);