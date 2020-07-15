import React, { useState } from 'react';
import { ButtonBase, Container, Typography } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { useStyles } from '../styles/home';

export default function NavButtonBase(props) {
  const classes = useStyles(props, 'navButtonBase');
  const { graphics } = props;

  const [ redirectPath, setRedirectPath ] = useState({});
  
  delete graphics['location'];  // remove identifier key-value pair ({location: /home}) to be able to map through the graphics data;
  const graphicsArr = Object.values(graphics); 

  const handleClick = event => {
    switch(event.currentTarget.id) {
      case 'School Information':
        setRedirectPath({
            pathname: '/schools', 
            state: { title: 'School Information', selected: 0 }
          });
        break;

      case 'Study Abroad': 
        setRedirectPath({
          pathname: '/goose', 
          state: { title: 'Goose Study Abroad', selected: 0 }
        });
        break;

      case 'Homestay':
        setRedirectPath({
          pathname: '/studyabroad', 
          state: { title: 'Study Abroad', selected: 0 }
        });
        break;

      case 'Airport Ride':
        setRedirectPath({
          pathname: '/studyabroad', 
          state: { title: 'Study Abroad', selected: 1 }
        });
        break;
        
      default:
        console.log('Missing path redirect for the clicked ID.')
    }
  }

  return (
    <Container className={classes.root}>
      <div className={classes.row}>
        {graphicsArr.map((graphic, i) => (
          <ButtonBase
            key={i}
            className={classes.imageWrapper}
            style={{ width: (i === 0) ? '37%' : (i === 1) ? '18%' : '22.5%'}}
          >
            <div
              className={classes.imageSrc}
              style={{ backgroundImage: `url(${graphic.image})` }}
            />
            <div className={classes.imageBackdrop} />
            <div className={classes.imageButton} id={graphic.title} onClick={handleClick}>
              {(Object.entries(redirectPath).length) ? 
                <Redirect push to={redirectPath}/> 
                : 
                <Typography
                  component="span"
                  variant="h6"
                  color="inherit"
                  className={classes.imageTitle}
                >
                  {graphic.title}
                  <div className={classes.imageMarked} />
                </Typography>
              }
              <Typography
                component="span"
                variant="caption"
                color="inherit"
                className={classes.imageDescription}
              >
                {graphic.caption}
                <div className={classes.imageMarked} />
              </Typography>
            </div>
          </ButtonBase>
        ))}
      </div>
    </Container>
  );
}