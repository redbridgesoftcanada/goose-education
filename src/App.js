import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

// Page Components
import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import Goose from './GooseStudyAbroad';
import Networking from './Networking';
import Schools from './Schools';
import StudyAbroad from './StudyAbroadServices';
import ServiceCentre from './ServiceCentre';
import Privacy from './Privacy';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';

// React Context Components
import { withAuthentication } from './components/session';

// d u m m y  d a t a b a s e  o b j e c t s
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

function App() {
  return (
    <div className="App">
      <ScrollToTop>
        <Switch>
          <Route path="/profile" render={() => <Profile/>}/>
          <Route path="/forgotpassword" render={() => <ForgotPassword/>}/>
          <Route path="/login" render={() => <Login/>}/>
          <Route path="/register" render={() => <Register/>}/>
          <Route path="/privacy" render={() => <Privacy/>}/>
          <Route path="/services" render={(props) => <ServiceCentre {...props} announcementsDB={announcementsDB} messagesDB={messagesDB}/>}/>
          <Route path="/studyabroad" render={(props) => <StudyAbroad {...props} />}/>
          <Route path="/schools" render={(props) => <Schools {...props} />}/>
          <Route path="/networking" render={(props) => <Networking {...props} />}/>
          <Route path="/goose" render={(props) => <Goose {...props} />}/>
          <Route exact path="/" render={() => <Home /> }/>
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default withAuthentication(App);
