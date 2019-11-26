import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

const backgroundImage =
  `${require('../assets/img/m01_t.jpg')}`;

const styles = theme => ({
  background: {
    backgroundImage: `${backgroundImage}`,
    backgroundColor: theme.palette.common.white,
    backgroundPosition: 'center',
  },
  title: {
    position: 'absolute',
    marginTop: '90px',
    color: theme.palette.common.white,
  }
});

function HeaderBanner(props) {
  const { classes } = props;

  return (
    <div>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={'headerBanner'}>
        {/* Increase the network loading priority of the background image. */}
        <img src={backgroundImage} alt='background banner'/>
        <Typography className={classes.title} color="inherit" align="center" variant="h4">
          Goose Study Abroad
        </Typography>
      </PageBannerLayout>
    </div>
  );
}

HeaderBanner.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeaderBanner);