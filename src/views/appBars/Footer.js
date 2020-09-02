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
          <IconButton className={classes.icon} color='inherit' href={FR1.image} target="_blank"><Instagram/></IconButton>
          <IconButton className={classes.icon} color='inherit' href={FR2.image} target="_blank"><Facebook/></IconButton>
          <IconButton className={classes.icon} href={FR3.image} target="_blank"><Kakao/></IconButton>
          <IconButton className={classes.icon} href={FR4.image} target="_blank"><Naver/></IconButton>
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
      {props.subtitle}
      {' '}
      {props.caption}
    </>
  );
}