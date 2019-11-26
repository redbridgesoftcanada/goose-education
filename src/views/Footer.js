import React from 'react';
import { Container, Grid, IconButton, Link, makeStyles } from '@material-ui/core';
import { Facebook, Instagram } from '@material-ui/icons';

import Typography from '../components/onePirate/Typography';

function Copyright() {
  return (
    <React.Fragment>
      {'COPYRIGHT © '}
      <Link color="inherit">
        Goose International
      </Link>{' '}
      ALL RIGHTS RESERVED
    </React.Fragment>
  );
}

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
    backgroundColor: '#bf1f22',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: 'none',
    paddingLeft: 0,
    fontSize: '13px',
    textAlign: 'left'
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));


export default function AppFooter() {
  const classes = useStyles();

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
                <li className={classes.listItem}>
                  Goose Study Abroad | Privacy Policy
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
                <IconButton className={classes.icon} color='inherit' aria-label='Instagram'>
                  <Instagram/>
                </IconButton>
                <IconButton className={classes.icon} color='inherit' aria-label='Facebook'>
                    <Facebook/>
                </IconButton>
                <IconButton className={classes.icon} aria-label='Kakao Talk'>
                    <img src={require('../assets/img/sns_03.jpg')} alt='Kakao Talk'/>
                </IconButton>
                <IconButton className={classes.icon} aria-label='Naver'>
                    <img src={require('../assets/img/sns_04.jpg')} alt='Naver'/>
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