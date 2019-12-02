import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import HeaderBanner from './views/HeaderBanner';
import GooseOverview from './views/GooseOverview';
import GooseCoreFeatures from './views/GooseCoreFeatures';
import GoosePlatform from './views/GoosePlatform';
import GooseTips from './views/GooseTips';
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
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

function GooseEdu(props) {
    const classes = useStyles();

    // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
    const [value, setValue] = useState(props.location.state.selected);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
      setValue(props.location.state.selected)
    }, [props.location.state.selected]);

    return (
        <React.Fragment>
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
                    <Tab label="Goose Education" />
                    <Tab label="Goose Tips" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <GooseOverview/>
                    <GooseCoreFeatures/>
                    <GoosePlatform/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <GooseTips/>
                </TabPanel>
            </Paper>
            <Footer/>
        </React.Fragment>
    )
}

export default withRoot(GooseEdu);