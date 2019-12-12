import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import PageBanner from './views/PageBanner';
import Poster from './views/Poster';
import ListOfSchools from './views/ListOfSchools';
import HowToUse from './views/HowToUse';
import Footer from './views/Footer';
import SchoolInformation from './views/SchoolInformation';

const schoolsDB = [
  { 
      id: 1,
      name: 'iTTTi',
      type: 'ESL',
      location: 'Vancouver',
      url: 'https://www.ittti.ca/',
      dateOfEstablishment: '1999', 
      image: '643318286_1fRTZOz6_dc1f626815427c94079076f6c9e8b8047d70a753.jpg',
      introduction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      features: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      program: '',
      expenses: '',
      numberOfStudents: '100-150',
      openingProcess: 'ESL, 비지니스, 인터뷰 마스터, 직업 영어 전문과정, 대학 입시, 시험대비반',
      accommodation: '홈스테이',
      googleUrl: '',
      youtubeUrl: ['<iframe width="800" height="450" src="https://www.youtube.com/embed/AC4UTGSWE8s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
      recommendation: false,
  },
  { 
      id: 2,
      name: 'Canadian College',
      type: 'College',
      location: 'Vancouver',
      url: 'http://canadiancollege.com/',
      dateOfEstablishment: '2008', 
      image: '643318286_rWCPoe2b_b73c26645a2423027ce454bad53c626ba551d40f.png',
      introduction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      features: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      program: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      expenses: '',
      numberOfStudents: '150-200',
      openingProcess: '비지니스, 호텔경영, IT, 코업 프로그램',
      accommodation: '기숙사, 홈스테이',
      googleUrl: '',
      youtubeUrl: ['<iframe width="800" height="450" src="https://www.youtube.com/embed/7MSMit3R2Yg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
      recommendation: false,
  },
  { 
      id: 3,
      name: 'Canadian College of English Language: CCEL',
      type: 'ESL Institution',
      location: 'Vancouver',
      url: 'http://canada-english.com/kr/',
      dateOfEstablishment: '1991', 
      image: '643318286_pnTMAq4w_54ae6ae567fab4ace2b71e9a84c87a004246b72c.jpg',
      introduction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      features: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      program: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      expenses: '',
      numberOfStudents: '350-400',
      openingProcess: '일반영어, 대학진학프로그램, IELTS, 비지니스',
      accommodation: '기숙사, 홈스테이',
      googleUrl: '',
      youtubeUrl: ['<iframe width="800" height="450" src="https://www.youtube.com/embed/_Jup8n53lpQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
      recommendation: false,
  },
  { 
      id: 4,
      name: 'VGC International College',
      type: 'ESL Institution',
      location: 'Vancouver',
      url: 'https://vgc.ca/',
      dateOfEstablishment: '2003', 
      image: '643318286_FJwZWadr_80c2bd93bca11f3851065b838fba3fa007edfdb8.png',
      introduction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      features: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      program: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      expenses: '',
      numberOfStudents: '450-500',
      openingProcess: '인턴쉽, 대학 진학, 시험 준비반 (IELTS, TOEFL), 일반영어',
      accommodation: '홈스테이',
      googleUrl: '',
      youtubeUrl: ['<iframe width="800" height="450" src="https://www.youtube.com/embed/q_Xz3ICFEA8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>', '<iframe width="800" height="450" src="https://www.youtube.com/embed/77MOeoeQkEk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
      recommendation: true,
  },
  { 
      id: 5,
      name: 'Language Across Borders: LAB',
      type: 'ESL Institution',
      location: 'Vancouver',
      url: 'https://www.languagesacrossborders.com/',
      dateOfEstablishment: '1992', 
      image: '643318286_0VOmxsjf_9543fc13de864fcb50b1e2f608b8cb4e11cbd05d.png',
      introduction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      features: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      program: 'Cat ipsum dolor sit amet, what a cat-ass-trophy!. Meow in empty rooms touch water with paw then recoil in horror i like cats because they are fat and fluffy fall over dead (not really but gets sypathy) destroy house in 5 seconds yet terrorize the hundred-and-twenty-pound rottweiler and steal his bed, not sorry.',
      expenses: '',
      numberOfStudents: '200-300',
      openingProcess: 'ESL (기초 영어) 레벨 1-10, 스피킹, 리스닝, 비즈니스 영어, IELTS, 대학 진학 준비 수업 등',
      accommodation: '홈스테이, 기숙사',
      googleUrl: '',
      youtubeUrl: ['<iframe width="800" height="450" src="https://www.youtube.com/embed/8rsVCS_Bxmw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>', '<iframe width="800" height="450" src="https://www.youtube.com/embed/fnPgTtpZ73A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
      recommendation: true,
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

function Schools(props) {
  const classes = useStyles();
  let match = useRouteMatch();
  
  
  const background = 'https://images.unsplash.com/photo-1544108182-8810058c3a7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80';
  const posterBackground = 'https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  const posterBody = {
    title: 'School Information',
    subtitle: 'Find the best school for you with Goose!',
    caption: "We take a closer look at Vancouver's many schools and provide you with a variety of accurate and up-to-date information to help you choose the school that is best for you. Because different people have different criteria for choosing a school, it's important to find a school that's right for you. Goose Study Abroad objectively introduces all of Vancouver's schools.",
    other: ''
  }

  const posterBackground2 = 'https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80';
  const posterBody2 = {
    title: 'Canada : Vancouver',
    subtitle: '',
    caption: "Vancouver, Canada, is the world's most livable city and is at the top of every year and is known as a safe, beautiful and pleasant city in all areas of culture, environment, education and security. Best of all, Canada speaks the most common American English language, with no special accents among English-speaking countries, so you will be able to communicate with people no matter where you travel or work in the future. In particular, you can enjoy Vancouver's sea, mountains, forests, cities, islands, and lakes while studying English.",
    other: ''
  }

  // opening the corresponding tab content on Goose Study Abroad (/abroad) page from React Router props.
  const [value, setValue] = useState(props.location.state.selected);
  const handleChange = (event, newValue) => setValue(newValue);

  const [selectedSchool, setSelectedSchool] = useState(props.location.state.selectedSchool);
  const handleSchoolClick = event => setSelectedSchool(schoolsDB.find(school => school.id.toString() === event.currentTarget.id));

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
              <Tab label="School Information" />
              {/* if not logged in, disable with <Tooltip> onHover title? */}
              <Tab label="School Application" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Switch>
              <Route path={`${match.path}/:schoolID`}>
                <SchoolInformation selectedSchool={selectedSchool} />
              </Route>
              <Route path={match.path}>
                <Poster body={posterBody} backgroundImage={posterBackground} layoutType='school_information'/>
                <ListOfSchools schoolsDB={schoolsDB} handleSchoolClick={handleSchoolClick}/>
              </Route>
            </Switch>
          </TabPanel>
          <TabPanel value={value} index={1}>
          </TabPanel>
      </Paper>
      <HowToUse/>
      <Poster body={posterBody2} backgroundImage={posterBackground2} layoutType='canada_vancouver'/>
      <Footer/>
    </>
  )
}
  
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default withRoot(Schools);