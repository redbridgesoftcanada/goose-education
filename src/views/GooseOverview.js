import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

const backgroundImage =
  'https://images.unsplash.com/photo-1518459599785-1705d14bbca2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1991&q=80';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  title: {
    position: 'absolute',
    color: theme.palette.common.black,
  },
  description: {
    position: 'absolute',
    marginTop: '75px',
    color: theme.palette.common.black,
  },
});

function GooseOverview(props) {
  const { classes } = props;

  return (
    <div className={classes.background}>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={'headerBanner'}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='By Luc Tribolet on Unsplash'/>
        <Typography color="inherit" align="center" variant="h3" marked="center" className={classes.title}>
            Goose Edu
        </Typography>
        <Typography  color="inherit" align="center" variant="body1" className={classes.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </PageBannerLayout>
    </div>
  );
}

GooseOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GooseOverview);