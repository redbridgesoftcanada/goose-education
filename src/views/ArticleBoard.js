import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, withStyles } from '@material-ui/core';
import Typography from '../components/onePirate/Typography';

import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchBar from '../components/SearchBar';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';

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
    const { classes, articlesDB } = props;

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
                <Filter handleFilterClick={handleFilterClick}/>
                <Sort handleSortClick={handleSortClick}/>
                <SearchBar />
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