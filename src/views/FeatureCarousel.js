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
        display: 'inline-block',
        position: 'absolute',
        top: '35%',
        right: '5%',
    },
    media: {
        height: 200,
        backgroundPosition:'center', 
        backgroundSize:'contain',
    },
  });

function FeatureCarousel(props) {
    const { classes, featuredSchools } = props;

    const [redirectPath, setRedirectPath] = useState({});

    const handleClick = (event) => {
        switch(event.currentTarget.id) {
            case 'School Information':
                setRedirectPath({
                    pathname: '/schools', 
                    state: { title: 'School Information', tab: 0 }
                });
                break;
            
            default:
                const selectedSchool = featuredSchools.find(school => school.id.toString() === event.currentTarget.id);
                setRedirectPath({
                    pathname: `/schools/${selectedSchool.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                    state: { title: 'School Information', tab: 0, selectedSchool }
                });
        }
    };

    return (
        <Card className={classes.card}>
            <CardHeader
                title="School Information"
                titleTypographyProps={{ style: { fontWeight:700 }}}
                action={
                    (Object.entries(redirectPath).length) ? 
                    <Redirect push to={redirectPath}/>
                    :
                    <IconButton id='School Information' onClick={handleClick}>
                      <AddIcon />
                    </IconButton>
                }
            />
            <Carousel infinite autoPlay={5000}>
                {featuredSchools.map(school => {
                    return (
                        <div key={school.id}>
                            <CardMedia
                                className={classes.media}
                                image={require(`../assets/img/${school.image}`)}
                                title={school.name}
                                id={school.id}
                                onClick={handleClick}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5">
                                    {school.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {school.type} • {school.location}
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

export default withStyles(styles)(FeatureCarousel);