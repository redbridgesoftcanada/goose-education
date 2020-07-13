import React from 'react';
import { CardMedia, CardContent, Container, Typography, withStyles } from '@material-ui/core';
import Carousel from '@brainhubeu/react-carousel';

const styles = theme => ({
  root: {
    overflow: 'hidden',
  },
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
  },
  thumbnail: {
    "&:hover": {
        cursor: 'pointer',
    },
    height: 350,
    backgroundPosition:'center', 
    backgroundSize:'contain',
  },
  title: {
    marginTop: theme.spacing(7),
  },
  description: {
    maxWidth: 350
  },
});

function FeatureInstagram(props) {
  const { classes, instagram } = props;

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
                  className={classes.thumbnail}
                  image={media.media_url}
                  onClick={() => window.open(media.permalink, "_blank")}
                />
                <CardContent>
                  <Typography className={classes.description} gutterBottom variant="subtitle2">{cleanHashtags(media.caption)}</Typography>
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

export default withStyles(styles)(FeatureInstagram);