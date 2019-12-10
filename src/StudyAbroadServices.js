import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import HeaderBanner from './views/HeaderBanner';
import Homestay from './views/Homestay';
import HomestayProcess from './views/HomestayProcess';
import AirportOverview from './views/AirportOverview';
import Footer from './views/Footer';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-prevent-tabpanel-${index}`}
        aria-labelledby={`scrollable-prevent-tab-${index}`}
        {...other}
      >
        <Box pb={10}>{children}</Box>
      </Typography>
    );
}

function StudyAbroadServices(props) {
    const classes = useStyles();

    // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
    const [value, setValue] = useState(props.location.state.selected);

    const handleChange = (event, newValue) => setValue(newValue);

    useEffect(() => {
      setValue(props.location.state.selected)
    }, [props.location.state.selected]);

    return (
        <>
            <NavBar/>
            <HeaderBanner title={props.location.state.title}/>
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
                    <Typography color="inherit" align="center" variant="h3" marked="center">
                        Homestay
                    </Typography>
                    <Typography  color="inherit" align="center" variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </Typography>
                    <Homestay />
                    <HomestayProcess/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Typography color="inherit" align="center" variant="h3" marked="center">
                        Airport Ride
                    </Typography>
                    <Typography  color="inherit" align="center" variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </Typography>
                    <AirportOverview/>
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