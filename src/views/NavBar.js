import React from 'react';
import PropTypes from 'prop-types';
import { Link, Menu, MenuItem, withStyles } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

import HeaderBar from './HeaderBar';
import AppBar from '../components/onePirate/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/onePirate/Toolbar';
import StudyAboard from '../components/navlinks/StudyAbroad';
import Networking from '../components/navlinks/Networking';
import SchoolInformation from '../components/navlinks/SchoolInformation';
import StudyAbroadServices from '../components/navlinks/StudyAbroadServices';
import ServiceCentre from '../components/navlinks/ServiceCentre';
import StudyAbroadCounselling from '../components/navlinks/StudyAbroadCounselling';

const StyledMenu = withStyles(theme => ({
  paper: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}))(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
}}))(MenuItem);

const styles = theme => ({
  left: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  center: {
    flex: 3,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 2.75,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  logins: {
    flex: 1.61,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 14,
    color: theme.palette.common.black,
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  nested: {
    paddingLeft: theme.spacing(4),
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
});

function NavBar(props) {
  const { classes } = props;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* GOOSE EDU BRAND LOGO */}
          <div className={classes.left}>
            <Link
              variant="h6"
              underline="none"
              color="inherit"
              className={classes.title}
              component={RouterLink}
              to="/"
            >
              <img src={require("../assets/img/logo.png")} alt="Goose Edu Logo"/>
            </Link>
          </div>

          {/* COMPONENTS > NAVLINKS */}
          <div className={classes.center}>
            <StudyAboard classes={classes} StyledMenu={StyledMenu} StyledMenuItem={StyledMenuItem}/>
            <Networking classes={classes}/>
            <SchoolInformation classes={classes} StyledMenu={StyledMenu} StyledMenuItem={StyledMenuItem}/>
            <StudyAbroadServices classes={classes} StyledMenu={StyledMenu} StyledMenuItem={StyledMenuItem}/>
            <ServiceCentre classes={classes} StyledMenu={StyledMenu} StyledMenuItem={StyledMenuItem}/>
            <StudyAbroadCounselling classes={classes}/>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <HeaderBar classes={classes}/>
    </>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);