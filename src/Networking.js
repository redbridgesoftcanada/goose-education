import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Tabs, Tab, Typography as MUITypography, makeStyles } from '@material-ui/core';
import withRoot from './withRoot';

import Typography from './components/onePirate/Typography';

import NavBar from './views/NavBar';
import HeaderBanner from './views/HeaderBanner';
import ArticleBoard from './views/ArticleBoard';
import VancouverPoster from './views/VancouverPoster';
import Footer from './views/Footer';

const tabs = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),
  },
  board: {
    marginTop: theme.spacing(4),
  }
}));


function TabPanel(props) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;
  
  return (
    <MUITypography
      className={classes.board}
      component="div"
      role="tabpanel"
      hidden={value !== index}
        {...other}
    >
      <Box pb={10}>
        <ArticleBoard articlesDB={articlesDB}/>
        {/* {children} */}
      </Box>
    </MUITypography>
  );
}

function createTabPanel(value) {
  let tabPanelItems = [];

  for (let i = 0; i <= tabs.length; i++){
    tabPanelItems.push(<TabPanel value={value} index={i} key={i}></TabPanel>)
  }
  return tabPanelItems;
}

function Networking(props) {
  const classes = useStyles();
  
  const [value, setValue] = useState(0);
  
  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  return (
    <>
      <NavBar />
      <HeaderBanner title={props.location.state.title}/>
      <Typography variant="h3" marked="center" className={classes.title}>
        {props.location.state.title}
      </Typography>
      <Typography variant="body1" marked="center" className={classes.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
      <Paper className={classes.root}>
        <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            centered
        >
          {tabs.map(tab => {
            return <Tab key={tab.toLowerCase()} label={tab}/> 
          })}
        </Tabs>
        {createTabPanel(value)}
      </Paper>
      <VancouverPoster />
      <Footer />
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default withRoot(Networking);