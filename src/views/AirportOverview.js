import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Button from '../components/onePirate/Button';
import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

const backgroundImage =
  'https://images.unsplash.com/photo-1570688747221-eaac6319a727?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    opacity: 0.9
  },
  title: {
    position: 'absolute',
    width: '75em',
  },
  description: {
    position: 'absolute',
    marginTop: '75px',
    width: '75em',
  },
  buttons: {
    marginTop: theme.spacing(20),  
    display: 'flex',
  },
  button: {
    minWidth: 200,
  },
});

function AirportOverview(props) {
  const { classes } = props;

  return (
    <div className={classes.background}>
      <PageBannerLayout backgroundClassName={classes.background}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='By Luc Tribolet on Unsplash'/>
        <Typography color="inherit" align="center" variant="h3" marked="center" className={classes.title}>
            Study Abroad Services
        </Typography>
        <Typography  color="inherit" align="center" variant="body1" className={classes.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
        <div className={classes.buttons}>
            <Button
            color="secondary"
            variant="contained"
            size="medium"
            className={classes.button}
            component="a"
            // href="/premium-themes/onepirate/sign-up/"
            >
            Apply For Homestay
            </Button>
            <Button
            //   color="secondary"
            variant="contained"
            size="medium"
            className={classes.button}
            component="a"
            // href="/premium-themes/onepirate/sign-up/"
            >
            Apply For Airport Ride
            </Button>
        </div>
      </PageBannerLayout>
    </div>
  );
}

AirportOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AirportOverview);