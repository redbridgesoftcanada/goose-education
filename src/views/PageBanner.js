import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import Button from '../components/onePirate/Button';
import Typography from '../components/onePirate/Typography';
import PageBannerLayout from './PageBannerLayout';

const useStyles = (props, options) => {
  return makeStyles(theme => ({
    background: {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundPosition: 'center',
    },
    title: {
      position: 'absolute',
      color: theme.palette.common.white,
      ...(props.layoutType === 'headerBanner') ? {marginTop: 20} : {marginTop: 90},
    },
    ...(props.layoutType === 'headerBanner') && {
      button: {
        minWidth: 200,
      },
      h5: {
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
          marginTop: theme.spacing(10),
        },
      },
      more: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
      }
    }
  }))(props, options);
}

function PageBanner(props) {
  const classes = useStyles(props);
  const { backgroundImage, title, layoutType } = props;

  return (
    <>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='header background banner'/>
        {(layoutType === 'pageBanner') ?
          loadPageBanner(classes, title, props.caption)
          :  
          <Typography className={classes.title} align="center" variant="h4">{title}</Typography>
        }
      </PageBannerLayout>
    </>
  );
}

function loadPageBanner(classes, title, caption) {
  return (
    <>
      <Typography color="inherit" align="left" variant="h2" marked="center">{title}</Typography>
      <Typography  color="inherit" align="left" variant="body1" className={classes.more}>{caption}</Typography>
      <Button
        color="secondary"
        variant="contained"
        size="medium"
        className={classes.button}
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