import React from 'react';
import { Card, CardContent, CardHeader, CardMedia, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
 
const styles = theme => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 200,
    },
  });

function FeatureCarousel(props) {
    const { classes } = props;



    const slides = [
        {
            name: "VGC International College",
            description: "ESL Institiution • Vancouver",
            url: require("../assets/img/643318286_FJwZWadr_80c2bd93bca11f3851065b838fba3fa007edfdb8.png"),
        },
        {
            name: "Language Across Borders: LAB",
            description: "ESL Institiution • Vancouver",
            url: require("../assets/img/643318286_0VOmxsjf_9543fc13de864fcb50b1e2f608b8cb4e11cbd05d.png"),
        }
    ];

    return (
        <Card className={classes.card} style={{width: '50%', display: 'inline-block'}}>
            <CardHeader
                title="School Information"
                titleTypographyProps={{ style:{fontWeight:700 }}}
                action={
                    <IconButton aria-label="settings">
                      <AddIcon />
                    </IconButton>
                }
            />
            <Carousel infinite autoPlay={5000}>
                {slides.map(slide => {
                    return (
                        <div>
                        <CardMedia
                            className={classes.media}
                            image={slide.url}
                            title={slide.name}
                            style={{backgroundPosition:'center', backgroundSize:'contain'}}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {slide.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {slide.description}
                            </Typography>
                        </CardContent>
                    </div>
                    );
                })}
            </Carousel>
            <Dots value={slides.length}/>
        </Card>
      );
}

export default  withStyles(styles)(FeatureCarousel);