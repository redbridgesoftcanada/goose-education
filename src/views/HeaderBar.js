import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, InputAdornment, TextField } from '@material-ui/core'
import { Facebook, Instagram, Search } from '@material-ui/icons';

import AppBar from '../components/onePirate/AppBar';
import Toolbar from '../components/onePirate/Toolbar';

import Login from '../components/navlinks/Login';
import Register from '../components/navlinks/Register';
import MyPage from '../components/navlinks/MyPage';
import Logout from '../components/navlinks/Logout';

function HeaderBar(props) {
    const { classes } = props;

    return (
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
                <TextField
                    className={classes.textField}
                    id="input-with-icon-textfield"
                    placeholder="Search"
                    variant="outlined"
                    InputProps={{
                        style:{margin:'7px', marginLeft:'10px'},
                        startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                        ),
                    }}
                    inputProps={{style:{padding: '7.5px 14px'}}}
                />
                </div>


                {/* COMPONENTS > NAVLINKS */}
                <div className={classes.logins}>
                    <Login classes={classes}/>
                    <Register classes={classes}/>
                    <MyPage classes={classes}/>
                    <Logout classes={classes}/>
                </div>
            </Toolbar>
        </AppBar>
    );
};

HeaderBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default HeaderBar;