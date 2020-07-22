import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AppBar, Button, Grid, IconButton, InputAdornment, TextField, Toolbar } from '@material-ui/core'
import { Facebook, Instagram, Search } from '@material-ui/icons';
import { ReactComponent as Kakao } from '../assets/img/kakao-talk.svg';
import { ReactComponent as Naver } from '../assets/img/icon_blog.svg';
import { AuthUserContext } from '../components/session';
import { DatabaseContext } from '../components/database';
import * as NAVLINKS from '../components/navlinks';
import NavDrawer from './NavDrawer';
import useStyles from '../styles/constants';

function HeaderBar(props) {
    const classes = useStyles(props, 'headerBar');
    const [ drawer, setDrawerOpen ] = useState(false);
    const [ searchQuery, setQuery ] = useState('');
    
    const history = useHistory();
    const handleSearch = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            history.push({ 
                pathname:'/search', 
                search:`?query=${searchQuery}`, 
                state: {...props, resources: []} 
            });
            console.log('Empty array being sent as resources in HeaderBar.')
        }
    }

    return (
        <AppBar className={classes.appBar} elevation={0}>
            <Toolbar className={classes.toolbar}>
                <Grid container className={classes.container}>
                    <Grid item>
                        <Grid item className={classes.iconButtons}>
                            <IconButton className={classes.icon}><Instagram/></IconButton>
                            <IconButton className={classes.icon}><Facebook/></IconButton>
                            <IconButton className={classes.icon}>
                                <Kakao className={classes.customKakao}/>
                            </IconButton>
                            <IconButton className={classes.icon}>
                                <Naver className={classes.customNaver}/>
                            </IconButton>
                        </Grid>

                        <Grid item className={classes.search}>
                            <TextField
                                onChange={event => setQuery(event.target.value)}
                                onKeyDown={handleSearch}
                                variant='outlined'
                                placeholder="Search"
                                className={classes.searchBar}
                                InputProps={{
                                    className: classes.searchBarInput,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )}
                                }
                            />
                        </Grid>
                    </Grid>

                    <Grid item>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? 
                            <>
                                <Button className={classes.navlinkItem} onClick={() => setDrawerOpen(!drawer)}>    
                                    {(authUser && authUser.roles['admin']) ? 'Admin' : authUser.displayName}
                                </Button>
                                <DatabaseContext.Consumer>
                                    {({ state }) =>  state.homeGraphics &&
                                        <NavDrawer 
                                            title={state.homeGraphics.navDrawer.title}
                                            classes={classes} 
                                            authUser={authUser}
                                            isOpen={drawer}
                                            onClose={() => setDrawerOpen(!drawer)}
                                            Logout={NAVLINKS.Logout({classes})}/>
                                    }
                                </DatabaseContext.Consumer>
                                {NAVLINKS.MyPage(classes)}
                                {NAVLINKS.Logout({classes})}
                            </>
                            : 
                            <>
                                {NAVLINKS.Login(classes)}
                                {NAVLINKS.Register(classes)}
                            </>
                            }
                        </AuthUserContext.Consumer>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderBar;