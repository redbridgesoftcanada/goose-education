import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import HeaderBanner from './views/HeaderBanner';
import AnnouncementBoard from './views/AnnouncementBoard';
import Announcement from './views/Announcement';
import MessageBoard from './views/MessageBoard';
import Message from './views/Message';
import Footer from './views/Footer';

const announcementsDB = [
  { 
    id: 1,
    title: '공지사항 게시판 타이틀입니다',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    author: '슈퍼관리자',
    comments: [
      {
        avatar: '',
        username: 'test',
        content: 'test',
        date: '01.31 09:31',
      },
    ],
    views: 152,
    date: '01.04 11:38', //replace with react-moment
  },
  { 
    id: 2,
    title: '공지사항 게시판 타이틀입니다',
    description: '공지사항 게시판 타이틀입니다',
    author: '슈퍼관리자',
    comments: [],
    views: 76,
    date: '01.04 11:38', //replace with react-moment
  },
  { 
    id: 3,
    title: '공지사항 게시판 타이틀입니다',
    description: '공지사항 게시판 타이틀입니다',
    author: '슈퍼관리자',
    comments: [],
    views: 77,
    date: '01.04 11:38', //replace with react-moment
  },
  { 
    id: 4,
    title: '공지사항 게시판 타이틀입니다',
    description: '공지사항 게시판 타이틀입니다',
    author: '슈퍼관리자',
    comments: [],
    views: 82,
    date: '01.04 11:38', //replace with react-moment
  },
  { 
    id: 5,
    title: '공지사항 게시판 타이틀입니다',
    description: '공지사항 게시판 타이틀입니다',
    author: '슈퍼관리자',
    comments: [],
    views: 78,
    date: '01.04 11:38', //replace with react-moment
  },
  { 
    id: 6,
    title: '공지사항 게시판 타이틀입니다',
    description: '공지사항 게시판 타이틀입니다',
    author: '슈퍼관리자',
    comments: [],
    views: 72,
    date: '01.04 11:38', //replace with react-moment
  },
  { 
    id: 7,
    title: '공지사항 게시판 타이틀입니다',
    description: '공지사항 게시판 타이틀입니다',
    author: '슈퍼관리자',
    comments: [],
    views: 79,
    date: '01.04 11:38', //replace with react-moment
  },
];

const messagesDB = [
  { 
    id: 1,
    title: 'test',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    author: 'test',
    comments: [],
    views: 3,
    date: '01.21 09:35', //replace with react-moment
  },
  { 
    id: 2,
    title: '학비 질문',
    description: '밴쿠버 ESL 학교, LAB의 기본영어 클래스 학비가 어떻게 되나요?',
    author: 'Goose',
    comments: [],
    views: 6,
    date: '01.28 07:46', //replace with react-moment
  },
];

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

function ServiceCenter(props) {
    const classes = useStyles();
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
          <HeaderBanner title={props.location.state.title}/>
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