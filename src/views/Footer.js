import React from 'react';
import { Grid, IconButton, Link } from '@material-ui/core';
import { Facebook, Instagram } from '@material-ui/icons';
import { ReactComponent as Kakao } from '../assets/img/kakao-talk.svg';
import { ReactComponent as Naver } from '../assets/img/icon_blog.svg';
import { Link as RouterLink } from "react-router-dom";
import useStyles from '../styles/constants';

const instagramUrl = 'https://www.instagram.com/gooseedu/';
const facebookUrl = 'https://www.facebook.com/gooseedu';
const kakaoUrl = 'https://pf.kakao.com/_hNspC';
const naverUrl = 'https://blog.naver.com/gooseedu';

export default function FooterBar(props) {
  const classes = useStyles(props, 'footer');
  
  const handleIconClick = (event) => {
    switch(event.currentTarget.id) {
      case 'instagram':
        window.open(instagramUrl, '_blank');
      break;

      case 'facebook':
        window.open(facebookUrl, '_blank');
      break;

      case 'kakao':
        window.open(kakaoUrl, '_blank');
      break;

      case 'naver':
        window.open(naverUrl, '_blank');
      break;

      default:
    }
  }

  return (
    <Grid component='footer' container className={classes.root}>
      <Grid container item className={classes.leftWrapper}>
        <Grid item>
          <img src={require('../assets/img/flogo.png')} alt='Goose Education logo'/>
        </Grid>

        <Grid item>
          <ul className={classes.list}>
            <li>
              {LinkHighlight(classes, '/', 'Goose Study Abroad')}
              {' | '}
              {LinkHighlight(classes, '/privacy', 'Privacy Policy')}
            </li>
            <li className={classes.listItem}>
              Representative: Jay Hyun
            </li>
            <li className={classes.listItem}>
              Address: 487, Suji-ro, Suji-gu, Yongin-si, Gyeonggi-do, Korea
            </li>
            <li className={classes.listItem}>
              Personal Number: 010-5344-6642 (Korea)
            </li>
            <li className={classes.listItem}>
              Company Registration Number: 680-87-01164
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
          <Copyright/>
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

function Copyright() {
  return (
    <>
      {'COPYRIGHT © '}
      <Link color="inherit">Goose International</Link>
      {' '}
      ALL RIGHTS RESERVED
    </>
  );
}