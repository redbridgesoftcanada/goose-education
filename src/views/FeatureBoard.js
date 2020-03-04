import React, { useState } from 'react';
import { ButtonBase, Container, Typography, withStyles } from '@material-ui/core';
import { Redirect } from "react-router-dom";

const images = [
  {
    id: 1,
    url:
      'https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=400&q=80',
    title: 'School Information',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    width: '37%',
  },
  {
    id: 2,
    url:
      'https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?auto=format&fit=crop&w=400&q=80',
    title: 'Study Abroad',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    width: '18%',
  },
  {
    id: 3,
    url:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80',
    title: 'Homestay',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    width: '22.5%',
  },
  {
    id: 4,
    url:
      'https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=400&q=80',
    title: 'Airport Ride',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    width: '22.5%',
  }
];

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
  const { classes } = props;
  const [ redirectPath, setRedirectPath ] = useState({});

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
    }
  }

  return (
    <Container className={classes.root}>
      <div className={classes.row}>
        {images.map(image => (
          <ButtonBase
            key={image.id}
            className={classes.imageWrapper}
            style={{ width: image.width }}
          >
            <div
              className={classes.imageSrc}
              style={{ backgroundImage: `url(${image.url})` }}
            />
            <div className={classes.imageBackdrop} />
            <div className={classes.imageButton} id={image.title} onClick={handleClick}>
              {(Object.entries(redirectPath).length) ? 
                <Redirect push to={redirectPath}/> 
                : 
                <Typography
                  component="span"
                  variant="h6"
                  color="inherit"
                  className={classes.imageTitle}
                >
                  {image.title}
                  <div className={classes.imageMarked} />
                </Typography>
              }
              <Typography
                component="span"
                variant="caption"
                color="inherit"
                className={classes.imageDescription}
              >
                {image.description}
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