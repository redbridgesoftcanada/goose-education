import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { useStyles } from '../styles/schools';

export default function HowToUse(props) {
    const classes = useStyles(props, 'schoolInformation');
    const circledIndexes = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
    const { body } = props;
    const listOfText = body.caption.split('\n');

  return (
    <Container className={classes.posterRoot}>
        <Grid container className={classes.posterGrid}>
            <Grid item xs={12} md={6}>
                <Typography className={classes.posterTitle}>{body.title}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                {listOfText.map((text, i) => {
                    return (
                        <div className={classes.wrapper} key={i}>
                            <Typography className={classes.number}>{circledIndexes[i]}</Typography>
                            <Typography className={classes.posterBody}>{text}</Typography>
                        </div>
                    )
                })}
            </Grid>
        </Grid>
    </Container>
  );
}