import React from 'react';
import PropTypes from 'prop-types';
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
  const { classes } = props;

  return (
    <Container className={classes.root}>
        <Grid container alignContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
                <Typography color="secondary" variant="h4">
                    How To Use
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <div className={classes.wrapper}>
                    <Typography color="secondary" variant="body1" className={classes.number}>
                        ①
                    </Typography>
                    <Typography align="left" variant="body1">
                        Examine the characteristics of the various schools and programs.
                    </Typography>
                </div>
                <div className={classes.wrapper}>
                    <Typography color="secondary" variant="body1" className={classes.number}>
                        ②
                    </Typography>
                    <Typography align="left" variant="body1">
                        Choose the school and program that meet your criteria.
                    </Typography>
                </div>
                <div className={classes.wrapper}>
                    <Typography color="secondary" variant="body1" className={classes.number}>
                        ③
                    </Typography>
                    <Typography align="left" variant="body1">
                        Click the 'Apply Here' button and verify that the program is selected correctly.
                    </Typography>
                </div>
                <div className={classes.wrapper}>
                    <Typography color="secondary" variant="body1" className={classes.number}>
                        ④
                    </Typography>
                    <Typography align="left" variant="body1">
                        Fill in your information and click the 'Complete Application' button.
                    </Typography>
                </div>
                <div className={classes.wrapper}>
                    <Typography color="secondary" variant="body1" className={classes.number}>
                        ⑤
                    </Typography>
                    <Typography align="left" variant="body1">
                        Follow the instructions provided by the Goose Study Abroad Counselor to securely pay your tuition fees.
                    </Typography>
                </div>
                <div className={classes.wrapper}>
                    <Typography color="secondary" variant="body1" className={classes.number}>
                        ⑥
                    </Typography>
                    <Typography align="left" variant="body1">
                        After tuition payment is received, we will issue an application form.
                    </Typography>
                </div>
            </Grid>
        </Grid>
    </Container>
  );
}

HowToUse.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HowToUse);