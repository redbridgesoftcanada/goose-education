import React from 'react';
import clsx from 'clsx';
import { Container } from '@material-ui/core';
import useStyles from '../styles/constants';

function PageBannerLayout(props) {
  const classes = useStyles(props, 'pageBannerLayout');
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

export default PageBannerLayout;