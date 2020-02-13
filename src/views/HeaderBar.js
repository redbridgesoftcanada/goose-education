import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, InputAdornment, TextField } from '@material-ui/core'
import { Facebook, Instagram, Search } from '@material-ui/icons';

import AppBar from '../components/onePirate/AppBar';
import Toolbar from '../components/onePirate/Toolbar';
import { AuthUserContext } from '../components/session';
import Login from '../components/navlinks/Login';
import Register from '../components/navlinks/Register';
import MyPage from '../components/navlinks/MyPage';
import Logout from '../components/navlinks/Logout';
import SideDrawer from '../views/SideDrawer';

function toggleReducer(state, action) {
    const { type, payload } = action;
    switch(type) {
        case 'drawer':
            return {
                ... state,
                drawerOpen: !state.drawerOpen
            }
        
        case 'menu':
            const selectedMenu = payload.toLowerCase().replace(/ /g,"_");
            return {
                ...state,
                [selectedMenu]: !state[selectedMenu]
            }

        default: 
            break;
    }
}

function HeaderBar(props) {
    const { classes } = props;
    const [ state, dispatch ] = useReducer(toggleReducer, false);

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <div className={classes.left}>
                    <IconButton><Instagram/></IconButton>
                    <IconButton><Facebook/></IconButton>
                    <IconButton><img className={classes.kakao} src={require('../assets/img/kakao-talk.svg')} alt="Kakao Talk"/></IconButton>
                    <IconButton><img className={classes.naver} src={require('../assets/img/icon_blog.png')} alt="Naver"/></IconButton>
                    <TextField
                        className={classes.textField}
                        placeholder="Search"
                        variant="outlined"
                        InputProps={{
                            style:{margin: 7, marginLeft: 10},
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
                            <SideDrawer 
                            classes={classes} 
                            authUser={authUser}
                            isOpen={state.drawerOpen} 
                            state={{...state}}
                            handleClick={event => dispatch({ type: 'menu', payload: event.currentTarget.id })} 
                            onClose={() => dispatch({ type: 'drawer' })}/>
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