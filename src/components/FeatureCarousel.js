import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { Redirect } from "react-router-dom";
import { useStyles } from '../styles/home';
import '@brainhubeu/react-carousel/lib/style.css';

export default function FeatureCarousel(props) {
    const classes = useStyles(props, 'featureCarousel');
    const { featuredSchools } = props;

    const [ redirectPath, setRedirectPath ] = useState({});

    const handleClick = event => {
        if (event.currentTarget.id === 'School Information') {
            setRedirectPath({
                pathname: '/schools', 
                state: { title: 'School Information', selected: 0 }
            });
        } else {
            const selectedSchool = featuredSchools.find(school => school.id.toString() === event.currentTarget.id);
                setRedirectPath({
                    pathname: `/schools/${selectedSchool.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                    state: { title: 'School Information', selected: 0, selectedSchool }
                });
        }
    };

    return (
        <Card className={classes.featureCard}>
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