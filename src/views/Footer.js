import React from 'react';
import { Container, Grid, IconButton, Link, makeStyles } from '@material-ui/core';
import { Facebook, Instagram } from '@material-ui/icons';
import { Link as RouterLink } from "react-router-dom";

import Typography from '../components/onePirate/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    display: 'flex',
  },
  list: {
    margin: 0,
    listStyle: 'none',
    paddingLeft: 0,
    fontSize: 13,
    textAlign: 'left'
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  linkItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  link: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.dark,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  kakao: {
    width: 25,
    marginLeft: 1,
    marginTop: 1,
  },
  naver: {
    width: 27,
    marginLeft: 1,
  },
}));

function Copyright() {
  return (
    <>
      {'COPYRIGHT © '}
      <Link color="inherit">
        Goose International
      </Link>{' '}
      ALL RIGHTS RESERVED
    </>
  );
}

const instagramUrl = 'https://www.instagram.com/gooseedu/';
const facebookUrl = 'https://www.facebook.com/gooseedu';
const kakaoUrl = 'https://pf.kakao.com/_hNspC';
const naverUrl = 'https://blog.naver.com/gooseedu';

export default function AppFooter() {
  const classes = useStyles();
  
  const handleClick = (event) => {
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
    }
  }

  return (
    <Typography component='footer' className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={10}>
          <Grid item xs={6} md={6}>
            <Grid container justify='flex-start' spacing={3}>
              <Grid item>
                <img src={require('../assets/img/flogo.png')} alt='Goose Education logo'/>
              </Grid>
              <Grid item>
              <ul className={classes.list}>
                <li className={classes.linkItem}>
                  <Link
                  className={classes.link}
                  color="inherit"
                  underline="none"
                  component={RouterLink} 
                  to="/"
                  >
                    {'Goose Study Abroad'}
                  </Link>
                  |
                  <Link
                  className={classes.link}
                  color="inherit"
                  underline="none"
                  component={RouterLink} 
                  to="/"
                  >
                    {'Privacy Policy'}
                  </Link>
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
          </Grid>
          <Grid item xs={6} md={6}>
            <Grid container justify='flex-end' className={classes.iconsWrapper} spacing={2}>
              <Grid item className={classes.icons}>
                <IconButton className={classes.icon} color='inherit' id='instagram' onClick={handleClick}>
                  <Instagram/>
                </IconButton>
                <IconButton className={classes.icon} color='inherit' id='facebook' onClick={handleClick}>
                  <Facebook/>
                </IconButton>
                <IconButton className={classes.icon} id='kakao' onClick={handleClick}>
                  <img src={require('../assets/img/kakao-talk.svg')} alt='Kakao Talk' className={classes.kakao}/>
                </IconButton>
                <IconButton className={classes.icon} id='naver' onClick={handleClick}>
                    <img src={require('../assets/img/icon_blog.png')} alt='Naver' className={classes.naver}/>
                </IconButton>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}