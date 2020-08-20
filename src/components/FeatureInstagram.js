import React from 'react';
import { CardMedia, CardContent, Container, Typography } from '@material-ui/core';
import Carousel from '@brainhubeu/react-carousel';
import { MuiThemeBreakpoints } from '../constants/constants';
import { useStyles } from '../styles/home';

export default function FeatureInstagram(props) {
  const classes = useStyles(props, 'featureInstagram');
  const { instagram, title } = props;

  const smBreakpoint = MuiThemeBreakpoints().sm;
  const mdBreakpoint = MuiThemeBreakpoints().md;

  let slidesConfig = { };
  if (smBreakpoint) {
    slidesConfig.slidesPerPage = 1;
    slidesConfig.slidesPerScroll = 1;
  } else if (mdBreakpoint) {
    slidesConfig.slidesPerPage = 2;
    slidesConfig.slidesPerScroll = 2;
  } else {
    slidesConfig.slidesPerPage = 3;
    slidesConfig.slidesPerScroll = 3;
  }

  return (
    <section className={classes.root}>
      <Typography className={classes.header}>{title}</Typography>
      <Container className={classes.container} maxWidth={false}>  
        <Carousel autoPlay={8000} infinite {...slidesConfig}>
          {instagram.map(media => {
            return (
              <div key={media.id}>
                <CardMedia
                  className={classes.image}
                  image={media.media_url}
                  onClick={() => window.open(media.permalink, "_blank")}
                />
                <CardContent className={classes.cardContent}>
                  <Typography className={classes.caption} gutterBottom>{cleanHashtags(media.caption)}</Typography>
                </CardContent>
              </div>
            )})}
        </Carousel>
      </Container>
    </section>
  );
}

function cleanHashtags(caption) {
  let index;
  for (let i = 0; i < caption.length; i++) {
    if (caption[i] === "#" && i >= 90) {
      index = i;
      break;
    }
  }
  return caption.substring(0, index);
}