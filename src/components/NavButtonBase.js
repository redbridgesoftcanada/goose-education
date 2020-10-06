import React, { useEffect, useState, useRef } from 'react';
import { Box, ButtonBase, Typography } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { useStyles } from '../styles/home';

export default function NavButtonBase(props) {
  const classes = useStyles(props, 'navButtonBase');
  
  const { graphics } = props;
  delete graphics['location'];  // remove identifier key-value pair ({location: /home});
  const graphicsArr = Object.values(graphics); 

  let navButtons = new Set();
  navButtons.add(graphicsArr.find(graphic => graphic.title === 'School Information'));
  navButtons.add(graphicsArr.find(graphic => graphic.title === 'Study Abroad'));
  navButtons.add(graphicsArr.find(graphic => graphic.title === 'Homestay'));
  navButtons.add(graphicsArr.find(graphic => graphic.title === 'Airport Ride'));
  navButtons = Array.from(navButtons);
  
  const [ redirectPath, setRedirectPath ] = useState({});

  const assignRedirectPath = event => {
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
          state: { title: 'Study Abroad' }
        });
        break;

      case 'Airport Ride':
        setRedirectPath({
          pathname: '/studyabroad', 
          state: { title: 'Study Abroad' }
        });
        break;
        
      default:
        console.log('Missing path redirect for the clicked ID.')
    }
  }

  return (
    Object.keys(redirectPath).length ?
    <Redirect push to={redirectPath}/> 
    :
    <Box display='flex' flexWrap='wrap'>
      {navButtons.map((graphic, i) => (
        <ButtonBase key={i}
          className={classes.buttonBase}
          style={{ width: (i === 0) ? '37%' : (i === 1) ? '18%' : '22.5%' }}
        >
          <div className={classes.imageSrc} style={{ backgroundImage: `url(${graphic.image})` }}/>
          <div className={classes.imageBackdrop} />
          <div className={classes.imageButton} id={graphic.title} onClick={assignRedirectPath}>
            <Typography className={classes.imageTitle} component="span">
              {graphic.title}
              <div className={classes.imageMarked} />
            </Typography>

            <Typography className={classes.imageDescription} component="span">
              {graphic.caption}
              <div className={classes.imageMarked} />
            </Typography>
          </div>
        </ButtonBase>
      ))}
    </Box>
  );
}