import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, withStyles } from '@material-ui/core';
import { useRouteMatch } from "react-router-dom";
import Typography from '../components/onePirate/Typography';

import { AuthUserContext } from '../components/session';
import Compose from '../components/ComposeButton';
import ComposeDialog from '../components/ComposeDialog';
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

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'OPEN_COMPOSE':
            return { ...state, composeOpen: true }

        case 'CLOSE_COMPOSE':
            return { ...state, composeOpen: false }

        case 'OPEN_FILTER':
            return { ...state, filterOpen: true }
        
        case 'CLOSE_FILTER':
            return { ...state, filterOpen: false }
        
        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
        
        case 'CLOSE_SORT':
            return { ...state, anchorOpen: null }
        
        case 'OPEN_ARTICLE':
            let selectedArticle = payload.database.find(article => article.id.toString() === payload.selected.id)
            return { 
                ...state, 
                articleOpen: true, 
                selectedArticle
            }
        
        case 'CLOSE_ARTICLE':
            return { ...state, articleOpen: false, selectedArticle: null }
    }
}

const INITIAL_STATE = {
    composeOpen: false,
    filterOpen: false,
    anchorOpen: null,
    articleOpen: false,
    selectedArticle: null
}

function ArticleBoard(props) {
    const { classes, history, articlesDB } = props;
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { composeOpen, filterOpen, anchorOpen, articleOpen, selectedArticle } = state;
    let match = useRouteMatch();

    return (
        <section className={classes.root}>
            <Container>
                <AuthUserContext.Consumer>
                    { authUser => authUser ? 
                    <>
                        <Compose handleComposeClick={() => dispatch({ type: 'OPEN_COMPOSE' })}/> 
                        <ComposeDialog 
                        authUser={authUser} 
                        composeType={match.url}
                        composeOpen={composeOpen} 
                        onClose={() => dispatch({ type: 'CLOSE_COMPOSE' })} />
                        <ArticleDialog 
                        authUser={authUser} 
                        history={history}
                        articleOpen={articleOpen} 
                        onClose={() => dispatch({ type: 'CLOSE_ARTICLE' })} article={selectedArticle}/>
                    </>
                    : '' }
                </AuthUserContext.Consumer>
                <Filter handleFilterClick={() => dispatch({ type: 'OPEN_FILTER' })}/>
                <Sort handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
                <SearchBar />

                <FilterDialog filterOpen={filterOpen} onClose={() => dispatch({ type: 'CLOSE_FILTER' })} />
                <SortPopover anchorEl={anchorOpen} open={Boolean(anchorOpen)} onClose={() => dispatch({ type: 'CLOSE_SORT'})}/>

                <Grid container>
                    {articlesDB.map(article => {
                        return (
                            <Grid item xs={12} md={3} key={article.id} className={classes.background}>
                                <div className={classes.item} id={article.id} onClick={event => dispatch({ type: 'OPEN_ARTICLE', payload: { selected: event.currentTarget, database: articlesDB }})}>
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
                <Pagination />
            </Container>
        </section>
    );
}

ArticleBoard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArticleBoard);