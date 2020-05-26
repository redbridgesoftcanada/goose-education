import React, { useState } from 'react';
import { ButtonBase, Container, Typography, withStyles } from '@material-ui/core';
import { Redirect } from "react-router-dom";

const styles = theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
  },
  row: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
  },
  column: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      height: 100,
    },
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      opacity: 0.15,
    },
    '&:hover $imageMarked': {
      opacity: 0,
    },
    '&:hover $imageTitle': {
      border: '4px solid currentColor',
    },
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
  },
  imageDescription: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
    textAlign: 'left',
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
});

function FeatureBoard(props) {
  const [ redirectPath, setRedirectPath ] = useState({});
  
  const { classes, graphics } = props;
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

export default withStyles(styles)(FeatureBoard);