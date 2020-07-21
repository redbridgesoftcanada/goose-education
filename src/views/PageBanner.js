import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '../components/onePirate/Button';
import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';
import { useStyles } from '../styles/home';

function PageBanner(props) {
  const classes = useStyles(props, 'pageBanner');
  const { backgroundImage, title, layoutType } = props;
  
  const theme = useTheme();
  const checkPageBannerBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{ display:'none' }} src={backgroundImage} alt='header background banner'/>
        {(layoutType === 'pageBanner') ?
          loadPageBanner(classes, title, props.caption, checkPageBannerBreakpoint)
          :  
          <Typography className={classes.headerTitle} variant="h4">{title}</Typography>
        }
      </PageBannerLayout>
    </>
  );
}

function loadPageBanner(classes, title, caption, breakpoint) {
  return (
    <>
      <Typography className={classes.pageBannerTitle} variant={!breakpoint ? "h2" : "h4"} marked="center">{title}</Typography>
      <Typography className={classes.pageBannerCaption}>{caption}</Typography>
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