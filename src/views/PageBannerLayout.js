import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Container, makeStyles } from '@material-ui/core';

const useStyles = (props, options) => {
  let styles;
  switch (props.layoutType) {
    case 'headerBanner':
        styles = makeStyles(theme => ({
          root: {
            color: theme.palette.common.white,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.up('sm')]: {
              height: '22vh',
              minHeight: 205,
              maxHeight: 1300,
            },
          },
          container: {
            marginTop: 0,
            marginBottom: theme.spacing(14),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 'inherit',
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
        }))(props, options); 
        break;
    
    case 'pageBanner':
      styles = makeStyles(theme => ({
        root: {
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
        container: {
          marginTop: 0,
          marginBottom: theme.spacing(14),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 'inherit',
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
      }))(props, options);
      break; 
  }
  return styles;
};

function ProductHeroLayout(props) {
  const classes = useStyles(props);
  const { backgroundClassName, children } = props;
  
  return (
    <section className={classes.root}>
      <Container className={classes.container}>
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
};

export default ProductHeroLayout;