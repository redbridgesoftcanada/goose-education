import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, makeStyles } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
import TabPanel from './components/TabPanel';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import AnnouncementBoard from './views/AnnouncementBoard';
import Announcement from './views/Announcement';
import MessageBoard from './views/MessageBoard';
import Message from './views/Message';
import Footer from './views/Footer';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

function ServiceCenter(props) {
    const classes = useStyles();
    const { announcementsDB, messagesDB } = props;
    const background = 'https://images.unsplash.com/photo-1566694271474-27e7b2de5c16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
    let match = useRouteMatch();

    // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
    const [value, setValue] = useState(props.location.state.selected);
    const handleChange = (event, newValue) => setValue(newValue);
    
    useEffect(() => {
      setValue(props.location.state.selected)
    }, [props.location.state.selected]);

    // handle state for announcements tab
    const [selectedAnnounce, setAnnounce] = useState(null);
    const handleAnnounceClick = (event) => {
      setAnnounce(announcementsDB.find(announcement => announcement.id.toString() === event.currentTarget.id))
    };

    // handle state for messages tab
    const [selectedMessage, setMessage] = useState(null);
    const handleMessageClick = (event) => {
      setMessage(messagesDB.find(message => message.id.toString() === event.currentTarget.id))
    }

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
                  <Tab label="Announcements" />
                  <Tab label="Message Board" />
              </Tabs>
              <TabPanel value={value} index={0}>
              <Switch>
                <Route path={`${match.path}/announcement/:announcementID`}>
                  <Announcement selectedAnnounce={selectedAnnounce} />
                </Route>
                <Route path={match.path}>
                  <AnnouncementBoard announcementsDB={announcementsDB} handleClick={handleAnnounceClick}/>
                </Route>
              </Switch>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Switch>
                  <Route path={`${match.path}/message/:messageID`}>
                    <Message selectedMessage={selectedMessage}/>
                  </Route>
                  <Route path={match.path}>
                    <MessageBoard messagesDB={messagesDB} handleClick={handleMessageClick}/>
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

export default withRoot(ServiceCenter);