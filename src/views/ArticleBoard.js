import React, { useReducer, useEffect } from 'react';
import { Container, Grid, Link, withStyles } from '@material-ui/core';
import { Switch, Route, Link as RouterLink, useRouteMatch } from "react-router-dom";
import parse from 'html-react-parser';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers';
import Typography from '../components/onePirate/Typography';
import { AuthUserContext } from '../components/session';
import Compose from '../components/ComposeButton';
import ComposeDialog from '../components/ComposeDialog';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchField from '../components/SearchField';
import Article from '../views/Article';
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
    const { type, payload } = action;
  
    switch(type) {
        case 'LOAD_ARTICLES': 
            return { ...state, articles: payload }

        case 'OPEN_COMPOSE':
            return { ...state, composeOpen: true }

        case 'CLOSE_COMPOSE':
            return { ...state, composeOpen: false }

        case 'OPEN_FILTER':
            return { ...state, filterOpen: true }
        
        case 'CLOSE_FILTER':
            return { ...state, filterOpen: false }

        case 'FILTER_QUERY':
            const filterType = payload.name;
            const selectedType = payload.value;
            return {
                ...state,
                [filterType]: selectedType,
                isError: false,
                error: null,
            }

        case 'FILTER_ARTICLES':
            const { articles, filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(articles, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(articles, filterOption, filterQuery);

            } else {
                return {
                    ...state,
                    isError: true,
                    error: 'Please enter one or more filter terms.'
                }
            }

            if (filteredContent.length) {
                return {
                    ...state,
                    articles: filteredContent,
                    isFiltered: true,
                    filterOpen: false
                }
            } else {
                return {
                    ...state,
                    isError: true,
                    error: 'Sorry, no matches found!'
                }
            }
        
        case 'RESET_FILTER':
            return { 
                ...state,
                articles: payload,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: '',
                isError: false,
                error: null,                
            }

        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
        
        case 'CLOSE_SORT':
            const selectedSort = payload.id;
            const sortedArticles = sortQuery('articles', state.articles, selectedSort);
            
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                articles: sortedArticles
            }
        
        case 'OPEN_ARTICLE':
            const selectedArticle = payload.database.find(article => article.id.toString() === payload.selected.id);
            return { 
                ...state, 
                articleOpen: true, 
                selectedArticle
            }
        
        case 'CLOSE_ARTICLE':
            return { ...state, articleOpen: false, selectedArticle: null }
        
        case 'SEARCH_QUERY':
            const searchQuery = payload.value;
            return { ...state, searchQuery }

        case 'CHANGE_PAGE':
            const currentPage = payload;
            return { ...state, currentPage }
                    
        default:
            break;
    }
}

function ArticleBoard({classes, history, articlesDB}) {
    const INITIAL_STATE = {
        articles: [],
        articleOpen: false,
        selectedArticle: null,
        composeOpen: false,
        anchorOpen: null,
        selectedAnchor: '',
        isFiltered: false,
        filterOpen: false,
        filterOption: 'Title',
        filterConjunction: 'And',
        filterQuery: '',
        currentPage: 0,
        articlesPerPage: 10,
        isError: false,
        error: null
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { articles, articleOpen, selectedArticle, composeOpen, anchorOpen, selectedAnchor, isFiltered, filterOpen, filterOption, filterConjunction, filterQuery, searchQuery, currentPage, articlesPerPage } = state;
    const match = useRouteMatch();

    const totalArticles = articles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const indexOfLastArticle = (currentPage * articlesPerPage) + 1;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const paginatedArticles = (totalPages > 1) ? articles.slice(indexOfFirstArticle, indexOfLastArticle) : articles;

    useEffect(() => {
        dispatch({ type: 'LOAD_ARTICLES', payload: articlesDB });

        ValidatorForm.addValidationRule('isNotHTML', value => {
            if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
                return false;
            }
            return true;
        });
    }, [articlesDB]);

    return (
        <section className={classes.root}>
            <Container>
            <Switch>
              <Route path={`${match.path}/:articleID`}>
              <AuthUserContext.Consumer>
                {authUser => <Article 
                        article={selectedArticle}
                        authUser={authUser} 
                        history={history}
                        articleOpen={articleOpen} 
                        /> }
              </AuthUserContext.Consumer>
              </Route>
              <Route path={match.path}>
              <AuthUserContext.Consumer>
                    { authUser => authUser &&
                    <>
                        <Compose handleComposeClick={() => dispatch({ type: 'OPEN_COMPOSE' })}/> 
                        <ComposeDialog 
                        authUser={authUser} 
                        composeType={match.url}
                        composeOpen={composeOpen} 
                        onClose={() => dispatch({ type: 'CLOSE_COMPOSE' })} />
                    </>
                    }
                </AuthUserContext.Consumer>
                <Filter 
                    isFilter={isFiltered} 
                    handleFilterClick={() => dispatch({type: 'OPEN_FILTER'})} 
                    handleFilterReset={() => dispatch({type: 'RESET_FILTER', payload: articlesDB})}/>
                <Sort 
                    selectedAnchor={selectedAnchor}
                    handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
                <SearchField 
                    handleSearch={event => dispatch({type: 'SEARCH_QUERY', payload: event.target})}
                    handleSearchClick={() => history.push({pathname:'/search', search:`?query=${searchQuery}`, state: {...state, resources: articles} })}/>

                <FilterDialog
                    isError={state.isError}
                    error={state.error}
                    filterOption={filterOption} filterConjunction={filterConjunction} filterQuery={filterQuery}
                    handleSearchQuery={event => dispatch({type:'FILTER_QUERY', payload: event.target})}
                    handleSearchClick={() => dispatch({type:'FILTER_ARTICLES'})} 
                    filterOpen={filterOpen} 
                    onClose={() => dispatch({ type: 'CLOSE_FILTER' })} 
                />
                <SortPopover 
                anchorEl={anchorOpen} 
                open={Boolean(anchorOpen)} 
                onClose={event => dispatch({ type: 'CLOSE_SORT', payload: event.currentTarget})}/>

                <Grid container>
                    {paginatedArticles.map(article => {
                        return (
                            <Grid key={article.id} item xs={12} md={3} className={classes.background}>
                                <div className={classes.item} id={article.id} onClick={event => dispatch({ type: 'OPEN_ARTICLE', payload: { selected: event.currentTarget, database: articlesDB }})}>
                                <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to=
                                        {{
                                            pathname: `${match.path}/${article.id}`, 
                                            state: {
                                                title: 'Networking',
                                            }
                                        }}
                                    >

                                    <img
                                        className={classes.image}
                                        src={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)}
                                        alt='article-thumbnail'
                                    />
                                    <div className={classes.body}>
                                        <Typography variant='body1' className={classes.articleTitle} >
                                            {article.title}
                                        </Typography>
                                        <Typography component='div' noWrap variant='body2' className={classes.articleDescription}>
                                            {parse(article.description)}
                                        </Typography>
                                    </div>
                                    </Link>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
                <Pagination 
                    totalPages={totalPages}
                    currentPage={currentPage} 
                    resourcesPerPage={articlesPerPage}
                    handlePageChange={(event, newPage) => dispatch({type:'CHANGE_PAGE', payload: newPage})}
                />
              </Route>
              </Switch>
                
            </Container>
        </section>
    );
}

export default withStyles(styles)(ArticleBoard);