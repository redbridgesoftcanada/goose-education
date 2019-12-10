import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import GooseStudyAbroad from './GooseStudyAbroad';
import Networking from './Networking';
import Schools from './Schools';
import StudyAbroadServices from './StudyAbroadServices';
import ServiceCentre from './ServiceCentre';

const tipsDB = [
  { 
      id: 1,
      title: '[구스꿀띱] 게시글 제목입니다.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: '6_copy_14_2_copy_6_1_copy_2_2948936627_zlcboNC3_e1e0cdafaaf268f678768639069a77d6921aba1e.jpg',
      author: '최고관리자',
      comments: [],
      views: 162,
      date: '2018.12.31 16:48', //replace with react-moment
  },
];

const articlesDB = [
{ 
    id: 1,
    title: '벤쿠버 수시 맛집 – Nanaimo Sushi',
    description: '다양한 롤과 사시미!',
    image: 'thumb-2919655616_Y4WrbPxp_61cb5518540dad6db53cd54c36ec8e933ca690f7_283x288.jpg',
    author: '최고관리자',
    tag: 'Restaurant',
    comments: [],
    views: 38,
    date: '08.16 05:19', //replace with react-moment
    url: '',
    isFeatured: true,
},
{ 
    id: 2,
    title: '밴쿠버 캠핑 핫플 – Paradise Valley Campground',
    description: '밴쿠버에서 여름을 즐기기 위한 액티비티로 빠질 수 없는 캠핑!',
    image: 'thumb-2919655616_CBAr7uG6_6b5db15acd1fde70c69c532cf137351e2468feb1_283x288.jpg',
    author: '최고관리자',
    tag: 'Other',
    comments: [],
    views: 33,
    date: '08.16 05:13', //replace with react-moment
    url: '',
    isFeatured: true,
},
{ 
    id: 3,
    title: 'Bubble Tea Shop',
    description: `1680 Robson St, Vancouver; 4651 No 3 Rd #105, Richmond; 1764 Manitoba St, Vancouver`,
    image: 'thumb-643318286_ydhXINOi_408f5fdb2cf23cfa89626254c8bf675a784b19cc_283x288.jpg',
    author: '최고관리자',
    tag: 'Restaurant',
    comments: [],
    views: 39,
    date: '08.14 04:44', //replace with react-moment
    url: 'https://www.facebook.com/thebbtshop/',
    isFeatured: true,
},
{ 
    id: 4,
    title: 'Xing Fu Tang',
    description: `3432 Cambie Street, Vancouver; 1180 Pinetree Way, Coquitlam; 8030 Granville Street, Vancouver; 2675 Kingsway, Vancouver; 130-8311 Lansdowne Rd, Richmond`,
    image: 'thumb-643318286_VJOTHgMi_d12784f59d57b78a947c1584875ada7ecdcf3c5c_283x288.jpg',
    author: '최고관리자',
    tag: 'Restaurant',
    comments: [],
    views: 57,
    date: '08.14 04:42', //replace with react-moment
    url: 'https://www.xingfutang.ca/vancouver-menu.html',
    isFeatured: true,
    
},
{ 
    id: 5,
    title: '벤쿠버 수시 맛집 – Nanaimo Sushi',
    description: '다양한 롤과 사시미!',
    image: 'thumb-2919655616_Y4WrbPxp_61cb5518540dad6db53cd54c36ec8e933ca690f7_283x288.jpg',
    author: '최고관리자',
    tag: 'Restaurant',
    comments: [],
    views: 38,
    date: '08.16 05:19', //replace with react-moment
    url: '',
    isFeatured: false,
},
{ 
    id: 6,
    title: '밴쿠버 캠핑 핫플 – Paradise Valley Campground',
    description: '밴쿠버에서 여름을 즐기기 위한 액티비티로 빠질 수 없는 캠핑!',
    image: 'thumb-2919655616_CBAr7uG6_6b5db15acd1fde70c69c532cf137351e2468feb1_283x288.jpg',
    author: '최고관리자',
    tag: 'Other',
    comments: [],
    views: 33,
    date: '08.16 05:13', //replace with react-moment
    url: '',
    isFeatured: false,
},
{ 
    id: 7,
    title: 'Bubble Tea Shop',
    description: `1680 Robson St, Vancouver; 4651 No 3 Rd #105, Richmond; 1764 Manitoba St, Vancouver`,
    image: 'thumb-643318286_ydhXINOi_408f5fdb2cf23cfa89626254c8bf675a784b19cc_283x288.jpg',
    author: '최고관리자',
    tag: 'Restaurant',
    comments: [],
    views: 39,
    date: '08.14 04:44', //replace with react-moment
    url: 'https://www.facebook.com/thebbtshop/',
    isFeatured: false,
},
{ 
    id: 8,
    title: 'Xing Fu Tang',
    description: `3432 Cambie Street, Vancouver; 1180 Pinetree Way, Coquitlam; 8030 Granville Street, Vancouver; 2675 Kingsway, Vancouver; 130-8311 Lansdowne Rd, Richmond`,
    image: 'thumb-643318286_VJOTHgMi_d12784f59d57b78a947c1584875ada7ecdcf3c5c_283x288.jpg',
    author: '최고관리자',
    tag: 'Restaurant',
    comments: [],
    views: 57,
    date: '08.14 04:42', //replace with react-moment
    url: 'https://www.xingfutang.ca/vancouver-menu.html',
    isFeatured: false,  
},
];

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
    isFeatured: false,
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
    isFeatured: false,
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
    isFeatured: false,
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
    isFeatured: true,
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
    isFeatured: true,
},
];

function App() {
  return (
    <div className="App">
      <ScrollToTop>
        <Switch>
          <Route path="/services" render={(props) => <ServiceCentre {...props}/>}/>
          <Route path="/studyabroad" render={(props) => <StudyAbroadServices {...props} />}/>
          <Route path="/schools" render={(props) => <Schools {...props}/>}/>
          <Route path="/networking" render={(props) => <Networking {...props}/>}/>
          <Route path="/goose" render={(props) => 
            <GooseStudyAbroad 
              {...props}
              tipsDB={tipsDB}
            />}
          />

          <Route exact path="/" render={() => 
            <Home 
              tipsDB={tipsDB} 
              articlesDB={articlesDB} 
              schoolsDB={schoolsDB}
            /> }
          />
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default App;
