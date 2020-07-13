import React from 'react';
import clsx from 'clsx';
import { Container, makeStyles } from '@material-ui/core';

const useStyles = (props, options) => {
  const isHeaderBanner = props.layoutType === 'headerBanner';

  return makeStyles(theme => ({
    root: {
      color: theme.palette.common.white,
      position: 'relative',
      ...isHeaderBanner && { display: 'flex' },
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        ...isHeaderBanner ? 
          { height: '22vh', minHeight: 205 } : 
          { height: '80vh', minHeight: 500 },
        maxHeight: 1300
      },
    },

    container: {
      marginBottom: theme.spacing(14),
      ...isHeaderBanner ? 
        { marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 'inherit' } : 
        { marginTop: 130, marginLeft: 40, width: 950, float: 'left' },

      // display: isHeaderBanner ? 'flex' : 'block',
      // flexDirection: 'column',
      // alignItems: 'center',
      // maxWidth: 'inherit',
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
    }
  }))(props, options); 
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

export default ProductHeroLayout;