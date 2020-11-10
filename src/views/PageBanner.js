import React, { memo } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { MuiThemeBreakpoints } from '../constants/constants';
import Button from '../components/onePirate/Button';
import MarkedTypography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';
import useStyles from '../styles/constants';

const PageBanner = memo(props => {
  const { backgroundImage, title, layoutType } = props;

  const classes = useStyles(props, 'pageBanner');
  const xsBreakpoint = MuiThemeBreakpoints().xs;
  const smBreakpoint = MuiThemeBreakpoints().sm;
  
  return (
    <>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{ display:'none' }} src={backgroundImage} alt='header background banner'/>
        {(layoutType === 'pageBanner') ?
          loadPageBanner(classes, title, props.caption, smBreakpoint)
          :  
          <MarkedTypography className={classes.headerTitle} variant={!xsBreakpoint ? "h2" : "h4"}>{title}</MarkedTypography>
        }
      </PageBannerLayout>
    </>
  );
});

function loadPageBanner(classes, title, caption, breakpoint) {
  return (
    <>
      <MarkedTypography className={classes.pageBannerTitle} variant={!breakpoint ? "h2" : "h4"} marked="center">{title}</MarkedTypography>
      <MarkedTypography className={classes.pageBannerCaption}>{caption}</MarkedTypography>
      <Button
        className={classes.pageBannerButton}
        component={RouterLink}
        to={{
          pathname: '/goose', 
          state: {
            title: 'Goose Study Abroad',
            selected: 0
          }
        }}
      >
        View More
      </Button>
    </>
  )
}

export default PageBanner;