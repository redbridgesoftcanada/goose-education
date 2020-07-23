import React from 'react';
import { makeStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';
import PageBannerLayout from '../views/PageBannerLayout';

const useStyles = (props, options) => {
  let style;
  switch(props.layoutType){
    case 'vancouver_now':
        style = makeStyles(theme => ({
          background: {
            backgroundImage: `url(${props.backgroundImage})`,
            backgroundPosition: '50% 35%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.9
          },
          subtitle: {
            position: 'absolute',
            color: theme.palette.common.white,
            marginTop: 100
          },
          title: {
            position: 'absolute',
            color: theme.palette.common.white,
            marginTop: 140,
          },
          caption: {
            position: 'absolute',
            color: theme.palette.common.white,
            marginTop: 220,
          },
          bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(1.5)',
            color: theme.palette.secondary.main,
          },
        }))(props, options);
      break;

    default:
      style = makeStyles(theme => ({
        background: {
            backgroundImage: `url(${props.backgroundImage})`,
            backgroundPosition: '50% 35%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.9
        },
        title: {
            position: 'absolute',
            color: theme.palette.common.white,
        },
        subtitle: {
            position: 'absolute',
            marginTop: 70,
            color: theme.palette.common.white,
        },
        caption: {
            position: 'absolute',
            marginTop: 130,
            color: theme.palette.common.white,
        },
      }))(props, options);
      break;
  }
  return style;
}

function Poster(props) {
  const classes = useStyles(props);
  const { backgroundImage, body, layoutType } = props;

  const loadLayout = () => {
    let layout;
    switch(layoutType) {
      case 'vancouver_now':
      case 'study_abroad':
        layout = (
          <>
            <Typography align="center" variant="subtitle1" className={classes.subtitle}>
              {body.subtitle}
            </Typography>
            <Typography align="center" variant="h2" marked="center" className={classes.title}>
              {body.title}
            </Typography>
            <Typography align="center" variant="body1" className={classes.caption}>
              {body.caption}
            </Typography>
            {body.other}
          </>
        );
        break;
      
      default:
        layout = (
          <>
            <Typography align="center" variant="h2" marked="center" className={classes.title}>
              {body.title}
            </Typography>
            <Typography align="center" variant="subtitle1" className={classes.subtitle}>
              {body.subtitle}
            </Typography>
            <Typography align="center" variant="body1" className={classes.caption}>
              {body.caption}
            </Typography>
          </>
        );
        break;
    }
    return layout;
  }

  return (
    <div className={classes.background}>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='header background banner'/>
        {loadLayout()}
      </PageBannerLayout>
    </div>
  );
}

export default Poster;