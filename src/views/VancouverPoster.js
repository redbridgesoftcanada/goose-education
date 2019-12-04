import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

const backgroundImage =
  'https://images.unsplash.com/photo-1560814304-4f05b62af116?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1268&q=80';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  subtitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    width: '40em'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(1.5)',
    color: theme.palette.secondary.main,
  },
});

function VancouverPoster(props) {
  const { classes } = props;

  return (
    <div>
      <PageBannerLayout backgroundClassName={classes.background}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{ display: 'none' }} src={backgroundImage} alt='background banner'/>
            <Typography  color="inherit" align="left" variant="body1" className={classes.subtitle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
            <Typography color="secondary" align="left" variant="h2" marked="center">
                Vancouver Now
            </Typography>
            <Typography  color="inherit" align="left" variant="body2" className={classes.subtitle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={0} md={3}/>
                <Grid item xs={12} md={3}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography color="secondary">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Typography>
                            <span className={classes.bullet}>•</span>
                            <Typography variant="body2" component="p">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography color="secondary">
                                Cat ipsum dolor sit amet
                            </Typography>
                            <span className={classes.bullet}>•</span>
                            <Typography variant="body2" component="p">
                                Cat ipsum dolor sit amet, hunt anything that moves catty ipsum, yet pelt around the house and up and down stairs chasing phantoms but plan steps for world domination.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={0} md={3}/>
            </Grid>
      </PageBannerLayout>
    </div>
  );
}

VancouverPoster.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VancouverPoster);