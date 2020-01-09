import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Switch, Route, useRouteMatch } from "react-router-dom";
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';

import Button from './components/onePirate/Button';
import TabPanel from './components/TabPanel';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './views/Poster';
import HomestayProcess from './views/HomestayProcess';
import AbroadServiceApplication from './views/AbroadServiceApplication';
import Footer from './views/Footer';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    buttons: {
        marginTop: theme.spacing(20),  
        display: 'flex',
    },
    button: {
        minWidth: 200,
    },
}));

function StudyAbroadServices(props) {
    const classes = useStyles();
    
    let match = useRouteMatch();

    const background = 'https://images.unsplash.com/photo-1461709444300-a6217cec3dff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80';
    const posterBackground = 'https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
    const posterBody = {
        title: 'Study Abroad Services',
        subtitle: '',
        caption: "In addition to applying to school, prepare in advance for your needs. Homestay & Airport Ride is a service that can be planned directly from Goose. For other services, please contact Goose directly.",
        other: (
            <div className={classes.buttons}>
                <Button
                color="secondary"
                variant="contained"
                size="medium"
                className={classes.button}
                component={RouterLink} 
                to=
                {{
                    pathname: `${match.path}/homestay`, 
                    state: {
                    title: 'Study Abroad',
                    selected: 0
                    }
                }}
                >
                Apply For Homestay
                </Button>
                <Button
                // color="secondary"
                variant="contained"
                size="medium"
                className={classes.button}
                component={RouterLink} 
                to=
                {{
                    pathname: `${match.path}/airport`, 
                    state: {
                    title: 'Study Abroad',
                    selected: 1
                    }
                }}
                >
                Apply For Airport Ride
                </Button>
            </div>
        )
    }

    // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
    const [value, setValue] = useState(props.location.state.selected);
    const handleChange = (event, newValue) => setValue(newValue);

    useEffect(() => {
      setValue(props.location.state.selected)
    }, [props.location.state.selected]);

    return (
        <>
            <NavBar/>
            <PageBanner title={props.location.state.title} backgroundImage={background} layoutType='headerBanner'/>
            <Paper className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    variant="fullWidth"
                    centered
                >
                    <Tab label="Homestay" />
                    <Tab label="Airport Ride" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Switch>
                        <Route path={`${match.path}/homestay`}>
                            <AbroadServiceApplication classes={classes} />
                        </Route>
                        <Route path={match.path}>
                            <Typography color="inherit" align="center" variant="h3" marked="center">Homestay</Typography>
                            <Typography  color="inherit" align="center" variant="body1">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </Typography>
                            <Poster body={posterBody} backgroundImage={posterBackground} layoutType='study_abroad'/>
                        </Route>
                    </Switch>
                    <HomestayProcess/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Switch>
                        <Route path={`${match.path}/airport`}>
                            <AbroadServiceApplication classes={classes} />
                        </Route>
                        <Route path={match.path}>
                            <Typography color="inherit" align="center" variant="h3" marked="center">
                                Airport Ride
                            </Typography>
                            <Typography  color="inherit" align="center" variant="body1">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </Typography>
                            <Poster body={posterBody} backgroundImage={posterBackground} layoutType='study_abroad'/>
                        </Route>
                    </Switch>
                </TabPanel>
            </Paper>
            <Footer/>
        </>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default withRoot(StudyAbroadServices);