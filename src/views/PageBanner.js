import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Button from '../components/onePirate/Button';
import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

import FeatureCarousel from '../components/FeatureCarousel';

const backgroundImage =
  'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

function PageBanner(props) {
  const { classes } = props;

  return (
    <div>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={'pageBanner'}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{ display: 'none' }} src={backgroundImage} alt='background banner image'/>
        <Typography color="inherit" align="left" variant="h2" marked="center">
          Find your own path, make your dreams come true
        </Typography>
        <Typography  color="inherit" align="left" variant="body1" className={classes.more}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          size="medium"
          className={classes.button}
          component="a"
          // href="/premium-themes/onepirate/sign-up/"
        >
          View More
        </Button>
      </PageBannerLayout>
      <FeatureCarousel/>
    </div>
  );
}

PageBanner.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PageBanner);