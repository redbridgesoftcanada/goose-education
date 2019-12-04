import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, withStyles } from '@material-ui/core';
import Typography from '../components/onePirate/Typography';

import FilterSortSearch from '../components/FilterSortSearch';
import FilterDialog from '../components/FilterDialog';
import SortPopover from '../components/SortPopover';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';

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
    },
];

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3, 1),
        textAlign: 'left',
        cursor: 'pointer',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1, 0),
    },
    articleTitle: {
        fontWeight: 700,
        width: '18em',
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    },
    articleDescription: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '20em',
    },
    search: {
        float: 'right',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: '5px',
        paddingLeft: theme.spacing(1),
    },
    searchButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    filterButton: {
        float: 'left',
        color: theme.palette.primary.light,
        border: `2px solid ${theme.palette.primary.light}`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
});

function ArticleBoard(props) {
    const { classes } = props;

    const [state, setState] = useState({
        filterOpen: false,
        anchorEl: null,
        articleOpen: false,
        article: null,
    });

    const { filterOpen, anchorEl, articleOpen, article } = state;

    // COMPONENTS > Filter Dialog Modal 
    const handleFilterClick = () => setState({...state, filterOpen: true});
    const handleFilterClose = () => setState({...state, filterOpen: false});
    
    // // COMPONENTS > Sort Popover
    const handleSortClick = event => setState({...state, anchorEl: event.currentTarget});
    const handleSortClose = () => setState({...state, anchorEl: null});

    // // COMPONENTS > Article Dialog Modal 
    const handleArticleClick = event => setState({...state, articleOpen: true, article: articlesDB.find(article => article.id.toString() === event.currentTarget.id)});
    const handleArticleClose = () => setState({...state, articleOpen: false, article: null});

    return (
        <section className={classes.root}>
            <Container>
                <FilterSortSearch handleSortClick={handleSortClick} handleFilterClick={handleFilterClick} />
                <FilterDialog filterOpen={filterOpen} onClose={handleFilterClose} />
                <SortPopover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}/>
                <Grid container>
                    {articlesDB.map(article => {
                        return (
                            <Grid item xs={12} md={3} key={article.id} className={classes.background}>
                                <div className={classes.item} id={article.id} onClick={handleArticleClick}>
                                    <img
                                        className={classes.image}
                                        src={require(`../assets/img/${article.image}`)}
                                        alt='article-thumbnail'
                                    />
                                    <div className={classes.body}>
                                        <Typography variant='body1' className={classes.articleTitle} >
                                            {article.title}
                                        </Typography>
                                        <Typography noWrap variant='body2' className={classes.articleDescription}>
                                            {article.description}
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
                <ArticleDialog articleOpen={articleOpen} onClose={handleArticleClose} article={article}/>
                <Pagination />
            </Container>
        </section>
    );
}

ArticleBoard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArticleBoard);