import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

const backgroundImage =
  'https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: '50% 30%',
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
});

function SchoolsOverview(props) {
  const { classes } = props;

  return (
    <div className={classes.background}>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={'headerBanner'}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='By Luc Tribolet on Unsplash'/>
        <Typography color="inherit" align="center" variant="h3" marked="center" className={classes.title}>
            School Information
        </Typography>
        <Typography  color="inherit" align="center" variant="body1" className={classes.description}>
            Find the best school for you with Goose!
            <br/>
            <br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
      </PageBannerLayout>
    </div>
  );
}

SchoolsOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SchoolsOverview);