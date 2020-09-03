import React from 'react';
import clsx from 'clsx';
import { Container } from '@material-ui/core';
import useStyles from '../styles/constants';

function PageBannerLayout(props) {
  const classes = useStyles(props, 'pageBannerLayout');
  const { backgroundClassName, children } = props;

  const isPageBanner = props.layoutType === 'pageBanner';
  const isHeaderBanner = props.layoutType === 'headerBanner';
  const isCustomVancouverNow = props.layoutType === 'vancouver_now';
  const isCustomStudyAbroad = props.layoutType === 'study_abroad';
  const isPoster = !isPageBanner && !isHeaderBanner && !isCustomVancouverNow;

  const rootStyle = clsx({
    [classes.root]: true,
    [classes.pageRoot]: isPageBanner,
    [classes.headerRoot]: isHeaderBanner,
    [classes.customRoot]: isCustomVancouverNow,
    [classes.posterRoot]: isPoster || isCustomStudyAbroad
  });

  const containerStyle = clsx({
    [classes.defaultContainer]: !isPageBanner,
    [classes.pageContainer]: isPageBanner,
    [classes.posterContainer]: isPoster,
    [classes.customVancouverNow]: isCustomVancouverNow,
    [classes.customStudyAbroad]: isCustomStudyAbroad
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