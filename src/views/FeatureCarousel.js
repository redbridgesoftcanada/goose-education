import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardMedia, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { Redirect } from "react-router-dom";
 
const styles = theme => ({
    card: {
        maxWidth: 345,
        width: '50%',
        display: 'inline-block'
    },
    media: {
        height: 200,
        backgroundPosition:'center', 
        backgroundSize:'contain',
    },
  });

function FeatureCarousel(props) {
    const { classes, featuredSchools } = props;

    const [pathname, setPathname] = useState({});

    const handleClick = (event) => {
        switch(event.currentTarget.id) {
            case 'School Information':
                setPathname({
                    pathname: '/schools', 
                    state: {
                        title: 'School Information',
                        selected: 0
                    }
                });
                break;
            
            default:
                let selectedSchool = featuredSchools.find(school => school.id.toString() === event.currentTarget.id);
                setPathname({
                    pathname: `/schools/${selectedSchool.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                    state: {
                        title: 'School Information',
                        selected: 0,
                        selectedSchool: selectedSchool
                    }
                });
                break;
        }
    };

    return (
        <Card className={classes.card}>
            <CardHeader
                title="School Information"
                titleTypographyProps={{ style: { fontWeight:700 }}}
                action={
                    (Object.entries(pathname).length) ? 
                    <Redirect push to={pathname}/>
                    :
                    <IconButton id='School Information' onClick={handleClick}>
                      <AddIcon />
                    </IconButton>
                }
            />
            <Carousel infinite autoPlay={5000}>
                {featuredSchools.map(featured => {
                    return (
                        <div key={featured.id}>
                            <CardMedia
                                className={classes.media}
                                image={require(`../assets/img/${featured.image}`)}
                                title={featured.name}
                                id={featured.id}
                                onClick={handleClick}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5">
                                    {featured.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {featured.type} • {featured.location}
                                </Typography>
                            </CardContent>
                        </div>
                    );
                })}
            </Carousel>
            <Dots value={featuredSchools.length}/>
        </Card>
      );
}

export default  withStyles(styles)(FeatureCarousel);