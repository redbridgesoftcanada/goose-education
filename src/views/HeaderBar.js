import React, { Fragment, useReducer } from 'react';
import { Link as RouterLink } from "react-router-dom";
import PropTypes from 'prop-types';
import { Button, Collapse, Divider, Drawer, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader, TextField } from '@material-ui/core'
import { AccountCircle, DeleteForever, ExitToApp, ExpandLess, ExpandMore, Facebook, Instagram, Search } from '@material-ui/icons';

import AppBar from '../components/onePirate/AppBar';
import Toolbar from '../components/onePirate/Toolbar';
import { AuthUserContext } from '../components/session';

import Login from '../components/navlinks/Login';
import Register from '../components/navlinks/Register';
import MyPage from '../components/navlinks/MyPage';
import Logout from '../components/navlinks/Logout';

function createNestedMenuItems(menuPage) {
    let nestedPageMenuItems = [];
    switch(menuPage){
        case 'study_abroad':
            nestedPageMenuItems.push('Goose Study Abroad', 'Goose Tips');
            break;
        case 'school_information':
            nestedPageMenuItems.push('School Information', 'School Application');
            break;
        case 'study_abroad_services':
            nestedPageMenuItems.push('Homestay', 'Airport Ride');
            break;
        case 'service_centre':
            nestedPageMenuItems.push('Announcements', 'Message Board');
            break;
    }
    return nestedPageMenuItems;
}

function createNestedMenuLinks(selectedPage) {
    let nestedPageLink = {};
    switch (selectedPage) {
        case 'Goose Study Abroad':
        case 'Goose Tips':
            nestedPageLink = {
                pathname: '/goose', 
                state: {
                  title: 'Goose Study Abroad',
                  selected: (selectedPage === 'Goose Study Abroad' ? 0 : 1)
                }
            }
            break;
        case 'School Information':
        case 'School Application':
            nestedPageLink = {
                pathname: '/schools', 
                state: {
                  title: 'School Information',
                  selected: (selectedPage === 'School Information' ? 0 : 1)
                }
            }
            break;
        case 'Homestay':
        case 'Airport Ride':
            nestedPageLink = {
                pathname: '/studyabroad', 
                state: {
                  title: 'Study Abroad',
                  selected: (selectedPage === 'Homestay' ? 0 : 1)
                }
            }
        case 'Announcements':
        case 'Message Board':
            nestedPageLink = {
                pathname: '/services', 
                state: {
                  title: 'Service Centre',
                  selected: (selectedPage === 'Announcements' ? 0 : 1)
                }
            }
    }
    return nestedPageLink;
}

function toggleReducer(state, action) {
    let formattedActionType = action.type.toLowerCase().replace(/ /g,"_");
    switch(formattedActionType) {
        case 'drawer':
            return {
                ... state,
                drawerOpen: !state.drawerOpen
            }
        default: 
            return {
                ...state,
                [formattedActionType]: !state[formattedActionType]
            }
    }
}

function HeaderBar(props) {
    const { classes } = props;

    const [ state, dispatch ] = useReducer(toggleReducer, false);

    const userMenuItems = ['My Page', 'Change Information', 'Delete Account'];
    const pageMenuItems = ['Study Abroad', 'Networking', 'School Information', 'Study Abroad Services', 'Service Centre'];

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <div className={classes.left}>
                <IconButton>
                    <Instagram/>
                </IconButton>
                <IconButton>
                    <Facebook/>
                </IconButton>
                <IconButton>
                    <img className={classes.kakao} src={require('../assets/img/kakao-talk.svg')} alt="Kakao Talk"/>
                </IconButton>
                <IconButton>
                    <img className={classes.naver} src={require('../assets/img/icon_blog.png')} alt="Naver"/>
                </IconButton>
                <TextField
                    className={classes.textField}
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
                    <AuthUserContext.Consumer>
                        {authUser => authUser ? 
                        <>
                            <Button onClick={() => dispatch({ type: 'drawer' })}>{authUser.email}</Button>
                            <Drawer anchor='right' open={state.drawerOpen} onClose={() => dispatch({ type: 'drawer' })}>
                                <List>
                                    <ListItem>
                                        <Logout classes={classes}/>
                                    </ListItem>
                                    {userMenuItems.map((text, index) => (
                                    <ListItem
                                        button
                                        component={RouterLink} 
                                        to={index === 0 ? '/profile' : index === 1 ? '/' : '/' } 
                                        key={text}>
                                        <ListItemIcon>
                                            {index === 0 ? <AccountCircle /> : index === 1 ? <ExitToApp /> : <DeleteForever /> }
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                    ))}
                                    <Divider/>
                                    <ListSubheader>Navigation</ListSubheader>
                                    {pageMenuItems.map ((item, i) => {
                                        let formattedText = item.toLowerCase().replace(/ /g,"_");
                                        let nestedPageMenuItems = createNestedMenuItems(formattedText);
                                        return (
                                            <Fragment key={i}>
                                                {formattedText === 'networking' ? 
                                                <ListItem button component={RouterLink} to={{
                                                    pathname: '/networking', 
                                                    state: {
                                                      title: 'Networking'
                                                    }
                                                  }}>
                                                    <ListItemText primary={item}/>
                                                </ListItem>
                                                :
                                                <ListItem button id={item} onClick={(event) => dispatch({ type: `${event.currentTarget.id}` })}>
                                                    <ListItemText primary={item}/>
                                                    {(formattedText !== 'networking' && state[formattedText]) ? <ExpandLess /> : <ExpandMore />}
                                                </ListItem>
                                                }
                                                {nestedPageMenuItems.map((item, i) => {
                                                    let nestedPageLink = createNestedMenuLinks(item);
                                                    return (
                                                        <Collapse key={i} in={state[formattedText]} timeout='auto' unmountOnExit>
                                                            <ListItem button component={RouterLink} to={nestedPageLink} className={classes.nested}>
                                                                <ListItemText primary={item}/>
                                                            </ListItem>
                                                        </Collapse>
                                                    )
                                                })}
                                            </Fragment>
                                        )
                                    })}
                                </List>
                            </Drawer>
                            <MyPage classes={classes}/>
                            <Logout classes={classes}/>
                        </>
                        : 
                        <>
                            <Login classes={classes}/>
                            <Register classes={classes}/>
                        </>
                        }
                    </AuthUserContext.Consumer>
                </div>
            </Toolbar>
        </AppBar>
    );
};

HeaderBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default HeaderBar;