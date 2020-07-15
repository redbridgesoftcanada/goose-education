import React from 'react';
import { CardMedia, CardContent, Container, Typography } from '@material-ui/core';
import Carousel from '@brainhubeu/react-carousel';
import { useStyles } from '../styles/home';

export default function FeatureInstagram(props) {
  const classes = useStyles(props, 'featureInstagram');
  const { instagram } = props;

  return (
    <section className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" className={classes.title}>Follow Goose on Instagram</Typography>
      </div>
      <Container className={classes.container}>  
        <Carousel autoPlay={8000} infinite slidesPerPage={3} slidesPerScroll={3}>
          {instagram.map(media => {
            return (
              <div key={media.id}>
                <CardMedia
                  className={classes.image}
                  image={media.media_url}
                  onClick={() => window.open(media.permalink, "_blank")}
                />
                <CardContent>
                  <Typography className={classes.caption} gutterBottom variant="subtitle2">{cleanHashtags(media.caption)}</Typography>
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