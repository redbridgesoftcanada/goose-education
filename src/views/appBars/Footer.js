import React from 'react';
import { Grid, IconButton, Link } from '@material-ui/core';
import { Facebook, Instagram } from '@material-ui/icons';
import { ReactComponent as Kakao } from '../../assets/img/kakao-talk.svg';
import { ReactComponent as Naver } from '../../assets/img/icon_blog.svg';
import { Link as RouterLink } from "react-router-dom";
import useStyles from '../../styles/constants';

export default function FooterBar(props) {
  const classes = useStyles(props, 'footer');
  const { 
    leftWrapper: { FL1, FL2, FL3, FL4, FL5, FL6 }, 
    rightWrapper: { FR1, FR2, FR3, FR4, FR5 } 
  } = props;
  
  const handleIconClick = (event) => {
    switch(event.currentTarget.id) {
      case 'instagram':
        window.open(FR1, '_blank');
      break;

      case 'facebook':
        window.open(FR2, '_blank');
      break;

      case 'kakao':
        window.open(FR3, '_blank');
      break;

      case 'naver':
        window.open(FR4, '_blank');
      break;

      default:
        console.log(`No redirect link for ${event.currentTarget.id} in Footer.`)
        return;
    }
  }

  return (
    <Grid component='footer' container className={classes.root}>
      <Grid container item className={classes.leftWrapper}>
        <Grid item>
          <img src={require('../../assets/img/flogo.png')} alt='Goose Education logo'/>
        </Grid>

        <Grid item>
          <ul className={classes.list}>
            <li>
              {LinkHighlight(classes, '/', FL1.title)}
              {' | '}
              {LinkHighlight(classes, '/privacy', FL2.title)}
            </li>
            <li className={classes.listItem}>
              {FL3.title}
            </li>
            <li className={classes.listItem}>
              {FL4.title}
            </li>
            <li className={classes.listItem}>
              {FL5.title}
            </li>
            <li className={classes.listItem}>
              {FL6.title}
            </li>
          </ul>
        </Grid>
      </Grid>

      <Grid container item className={classes.rightWrapper}>
        <Grid item>
          <IconButton className={classes.icon} color='inherit' id='instagram' onClick={handleIconClick}>
            <Instagram/>
          </IconButton>
          <IconButton className={classes.icon} color='inherit' id='facebook' onClick={handleIconClick}>
            <Facebook/>
          </IconButton>
          <IconButton className={classes.icon} id='kakao' onClick={handleIconClick}>
            <Kakao/>
          </IconButton>
          <IconButton className={classes.icon} id='naver' onClick={handleIconClick}>
            <Naver/>
          </IconButton>
        </Grid>

        <Grid item className={classes.copyright}>
          <Copyright {...FR5}/>
        </Grid>
  
      </Grid>
    </Grid>
  );
}



function LinkHighlight(classes, path, text) {
  return (
    <Link
      component={RouterLink} 
      className={classes.linkHover}
      color="inherit"
      underline="none"
      to={path}
      >
        {text}
    </Link>
  );
}

function Copyright(props) {
  return (
    <>
      {props.title}
      <Link color="inherit">{props.subtitle}</Link>
      {' '}
      {props.caption}
    </>
  );
}