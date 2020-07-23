import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Switch, Route, useRouteMatch } from "react-router-dom";
import { Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';
import { AuthUserContext } from './components/session';
import Button from './components/onePirate/Button';
import TabPanel from './components/TabPanel';
import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './components/Poster';
import HomestayProcess from './components/HomestayProcess';
import StudyAbroadServiceApplication from './views/StudyAbroadServiceApplication';
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
    const match = useRouteMatch();

    const { pageBanner, poster, homestayBanner, homestayProcessBanner, airportRideBanner } = props;

    const posterBody = {
        title: poster.title,
        subtitle: '',
        caption: poster.caption,
        other: (
            <div className={classes.buttons}>
                <Button
                color="secondary"
                variant="contained"
                size="medium"
                className={classes.button}
                component={RouterLink} 
                to={{ pathname: `${match.path}/homestay`, state: { selected: 0 } }}>
                    Apply For Homestay
                </Button>
                <Button
                variant="contained"
                size="medium"
                className={classes.button}
                component={RouterLink} 
                to={{ pathname: `${match.path}/airport`, state: { selected: 1 } }}>
                    Apply For Airport Ride
                </Button>
            </div>
    )}

    // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
    const [value, setValue] = useState(props.location.state.selected);
    const handleChange = (event, newValue) => setValue(newValue);

    useEffect(() => {
      setValue(props.location.state.selected)
    }, [props.location.state.selected]);

    return (
        <>
            <NavBar/>
            <PageBanner title={pageBanner.title} backgroundImage={pageBanner.image} layoutType='headerBanner'/>
            <Paper className={classes.root}>
                <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                variant="fullWidth"
                centered>
                    <Tab label="Homestay" />
                    <Tab label="Airport Ride" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Switch>
                        <Route path={`${match.path}/homestay`}>
                        <AuthUserContext.Consumer>
                            { authUser => authUser ? <StudyAbroadServiceApplication authUser={authUser} /> : <Typography variant="h5">Please Register or Login to Apply</Typography> }
                        </AuthUserContext.Consumer>
                        </Route>
                        <Route path={match.path}>
                            <Typography color="inherit" align="center" variant="h3" marked="center">{homestayBanner.title}</Typography>
                            <Typography  color="inherit" align="center" variant="body1">{homestayBanner.caption}</Typography>
                            <Poster body={posterBody} backgroundImage={poster.image} layoutType='study_abroad'/>
                        </Route>
                    </Switch>
                    <HomestayProcess body={homestayProcessBanner}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Switch>
                        <Route path={`${match.path}/airport`}>
                        <AuthUserContext.Consumer>
                            { authUser => authUser ? <StudyAbroadServiceApplication authUser={authUser} /> : <Typography variant="h5">Please Register or Login to Apply</Typography> }
                        </AuthUserContext.Consumer>
                        </Route>
                        <Route path={match.path}>
                            <Typography color="inherit" align="center" variant="h3" marked="center">{airportRideBanner.title}</Typography>
                            <Typography  color="inherit" align="center" variant="body1">{airportRideBanner.caption}</Typography>
                            <Poster body={posterBody} backgroundImage={poster.image} layoutType='study_abroad'/>
                        </Route>
                    </Switch>
                </TabPanel>
            </Paper>
            <Footer/>
        </>
    )
}

export default withRoot(StudyAbroadServices);