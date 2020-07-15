import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import Button from '../components/onePirate/Button';
import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';
import { useStyles } from '../styles/home';

function PageBanner(props) {
  const classes = useStyles(props, 'pageBanner');
  const { backgroundImage, title, layoutType } = props;

  return (
    <>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='header background banner'/>
        {(layoutType === 'pageBanner') ?
          loadPageBanner(classes, title, props.caption)
          :  
          <Typography className={classes.headerTitle} variant="h4">{title}</Typography>
        }
      </PageBannerLayout>
    </>
  );
}

function loadPageBanner(classes, title, caption) {
  return (
    <>
      <Typography className={classes.pageBannerTitle} variant="h2" marked="center">{title}</Typography>
      <Typography className={classes.pageBannerCaption} variant="body1" >{caption}</Typography>
      <Button
        color="secondary"
        variant="contained"
        size="medium"
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