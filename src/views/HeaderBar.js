import React, { useState } from 'react';
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

    return (
        <AppBar className={classes.appBar} elevation={0}>
            <Toolbar className={classes.toolbar}>
                <Grid container className={classes.container}>
                    <Grid item>
                        <Grid item className={classes.iconButtons}>
                            <IconButton><Instagram/></IconButton>
                            <IconButton><Facebook/></IconButton>
                            <IconButton>
                                <Kakao className={classes.customKakao}/>
                            </IconButton>
                            <IconButton>
                                <Naver className={classes.customNaver}/>
                            </IconButton>
                        </Grid>

                        <Grid item className={classes.search}>
                            <TextField
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
                                <Button onClick={() => setDrawerOpen(!drawer)}>    
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
                                {NAVLINKS.MyPage()}
                                {NAVLINKS.Logout({classes})}
                            </>
                            : 
                            <>
                                {NAVLINKS.Login()}
                                {NAVLINKS.Register()}
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