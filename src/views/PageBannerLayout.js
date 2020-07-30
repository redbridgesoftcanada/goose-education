import React from 'react';
import clsx from 'clsx';
import { Container } from '@material-ui/core';
import useStyles from '../styles/constants';

function PageBannerLayout(props) {
  const classes = useStyles(props, 'pageBannerLayout');
  const { backgroundClassName, children } = props;

  const isPageBanner = props.layoutType === 'pageBanner';
  const isHeaderBanner = props.layoutType === 'headerBanner';
  const isCustomLayout = props.layoutType === 'vancouver_now';
  const isPoster = !isPageBanner && !isHeaderBanner && !isCustomLayout

  const rootStyle = clsx({
    [classes.root]: true,
    [classes.pageRoot]: isPageBanner,
    [classes.headerRoot]: isHeaderBanner,
    [classes.customRoot]: isCustomLayout,
    [classes.posterRoot]: isPoster
  });

  const containerStyle = clsx({
    [classes.defaultContainer]: !isPageBanner,
    [classes.pageContainer]: isPageBanner,
    [classes.posterContainer]: isPoster,
    [classes.customContainer]: isCustomLayout
  })
  
  return (
    <section className={rootStyle}>
      <Container className={containerStyle}>
        {children}
        <div className={classes.backdrop} />
        <div className={clsx(classes.background, backgroundClassName)} />
      </Container>
    </section>
  );
}

export default PageBannerLayout;