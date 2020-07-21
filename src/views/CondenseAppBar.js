import React, { useState } from 'react';
import { AppBar, Button, Grid, Link, Toolbar } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import { AuthUserContext } from '../components/session';
import { DatabaseContext } from '../components/database';
import * as NAVLINKS from '../components/navlinks';
import NavDrawer from './NavDrawer';
import useStyles from '../styles/constants';

export default function CondenseAppBar(props) {
  const classes = useStyles(props, 'navbar');
  const [ drawer, setDrawerOpen ] = useState(false);

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
                <img src={require("../assets/img/logo.png")} alt="Goose Edu Logo"/>
              </Link>
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
    </>
  );
}