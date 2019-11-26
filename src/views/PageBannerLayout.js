import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Container, withStyles } from '@material-ui/core';

const styles = theme => ({
  pageBannerRoot: {
    color: theme.palette.common.white,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      height: '80vh',
      minHeight: 500,
      maxHeight: 1300,
    },
  },
  headerBannerroot: {
    color: theme.palette.common.white,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      height: '80vh',
      minHeight: 500,
      maxHeight: 1300,
    },
  },
  pageBannerContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerBannerContainer: {
    // marginTop: theme.spacing(3),
    // marginBottom: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'inherit',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.5,
    zIndex: -1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
  },
});

function setSectionClass(classes, layoutType) {
  let chosenLayout;
  switch(layoutType){
    case 'headerBanner':
      chosenLayout = classes.headerBannerRoot;
      break;
    case 'pageBanner':
      chosenLayout = classes.pageBannerRoot;
      break;
    default:
      chosenLayout = null;
      break;
  }
  return chosenLayout;
}

function setContainerClass(classes, layoutType) {
  let chosenLayout;
  switch(layoutType){
    case 'headerBanner':
      chosenLayout = classes.headerBannerContainer;
      break;
    case 'pageBanner':
      chosenLayout = classes.pageBannerContainer;
      break;
    default:
      chosenLayout = null;
      break;
  }
  return chosenLayout;
}

function ProductHeroLayout(props) {
  const { backgroundClassName, children, classes, layoutType } = props;

  return (
    <section className={setSectionClass(classes, layoutType)}>
      <Container className={setContainerClass(classes, layoutType)}>
        {children}
        <div className={classes.backdrop} />
        <div className={clsx(classes.background, backgroundClassName)} />
      </Container>
    </section>
  );
}

ProductHeroLayout.propTypes = {
  backgroundClassName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHeroLayout);