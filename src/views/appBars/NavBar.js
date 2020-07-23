import React from 'react';
import { AppBar, Grid, Link, Toolbar } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import HeaderBar from '../HeaderBar';
import * as NAVLINKS from '../../components/navlinks';
import useStyles from '../../styles/constants';

export default function NavBar(props) {
  const classes = useStyles(props, 'navbar');

  return (
    <>
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Grid container className={classes.container}>
            <Grid item className={classes.logo}>
              <Link
                className={classes.title}
                component={RouterLink}
                to="/"
              >
                <img src={require("../../assets/img/logo.png")} alt="Goose Edu Logo"/>
              </Link>
            </Grid>

            <Grid item className={classes.navlinks}>
              {NAVLINKS.StudyAboard(classes)}
              {NAVLINKS.Networking(classes)}
              {NAVLINKS.SchoolInformation(classes)}
              {NAVLINKS.StudyAbroadServices(classes)}
              {NAVLINKS.ServiceCentre(classes)}
              {NAVLINKS.StudyAbroadCounselling(classes)}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <HeaderBar/>
    </>
  );
}