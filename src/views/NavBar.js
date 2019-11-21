import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';    // constructing className strings conditionally
import { IconButton, InputAdornment, Link, TextField, withStyles } from '@material-ui/core'
import { Facebook, Instagram, Search } from '@material-ui/icons';

import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';

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
  right: {
    flex: 3,
    display: 'flex',
    justifyContent: 'center',
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
          <div className={classes.left}>
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            className={classes.title}
            // href="/premium-themes/onepirate/"
          >
            <img src={require("../assets/img/logo.png")} alt="Goose Edu Logo"/>
          </Link>

          </div>
          <div className={classes.right}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'Study Abroad'}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'Networking'}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'School Information'}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'Study Abroad Services'}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'Service Center'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              className={clsx(classes.rightLink, classes.linkSecondary)}
              // component={}
            >
              {'Study Abroad Counseling'}
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left}>
            <IconButton aria-label="Instagram">
              <Instagram/>
            </IconButton>
            <IconButton aria-label="Facebook">
              <Facebook/>
            </IconButton>
            <IconButton aria-label="Kakao Talk">
              <img src={require("../assets/img/sns_03.jpg")} alt="Kakao Talk"/>
            </IconButton>
            <IconButton aria-label="Naver">
              <img src={require("../assets/img/sns_04.jpg")} alt="Naver"/>
            </IconButton>
          </div>
          <TextField
            className={classes.textField}
            id="input-with-icon-textfield"
            placeholder="Search"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.right}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'Login'}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'Sign In'}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              // component={}
            >
              {'My Page'}
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      {/* <div className={classes.placeholder} /> */}
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);