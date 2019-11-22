import React from 'react';
import PropTypes from 'prop-types';
import { Link, withStyles } from '@material-ui/core'

import HeaderBar from './HeaderBar';
import AppBar from '../components/onePirate/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/onePirate/Toolbar';
import StudyAboard from '../components/navlinks/StudyAbroad';
import Networking from '../components/navlinks/Networking';
import SchoolInformation from '../components/navlinks/SchoolInformation';
import StudyAbroadServices from '../components/navlinks/StudyAbroadServices';
import ServiceCenter from '../components/navlinks/ServiceCenter';
import StudyAbroadCounselling from '../components/navlinks/StudyAbroadCounselling';

const styles = theme => ({
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  center: {
    flex: 3,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  right: {
    flex: 2.75,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  right1: {
    flex: 1.61,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 14,
    color: theme.palette.common.black,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

function NavBar(props) {
  const { classes } = props;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>

          {/* GOOSE EDU BRAND LOGO */}
          <div className={classes.left}>
            <Link
              variant="h6"
              underline="none"
              color="inherit"
              className={classes.title}
              // component={}
            >
              <img src={require("../assets/img/logo.png")} alt="Goose Edu Logo"/>
            </Link>
          </div>

          {/* COMPONENTS > NAVLINKS */}
          <div className={classes.center}>
            <StudyAboard classes={classes}/>
            <Networking classes={classes}/>
            <SchoolInformation classes={classes}/>
            <StudyAbroadServices classes={classes}/>
            <ServiceCenter classes={classes}/>
            <StudyAbroadCounselling classes={classes}/>
          </div>
        </Toolbar>
      </AppBar>

      <Toolbar/>
      <HeaderBar classes={classes}/>
      
      {/* <div className={classes.placeholder} /> */}
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);