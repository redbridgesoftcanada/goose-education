import React, { useEffect, useReducer } from 'react';
import { Container, Grid, Link, Typography, withStyles } from '@material-ui/core';
import { Switch, Route, Link as RouterLink, useRouteMatch } from "react-router-dom";
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import parse from 'html-react-parser';
import { AuthUserContext } from '../components/session';
import Compose from '../components/ComposeButton';
import ComposeDialog from '../components/ComposeDialog';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchField from '../components/SearchField';
import Pagination from '../components/Pagination';
import Article from '../views/Article';

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
            return { ...state, filteredArticles: payload }

        case 'TOGGLE_COMPOSE':
            return { ...state, composeOpen: !state.composeOpen }

        case 'TOGGLE_FILTER':
            return { ...state, filterOpen: !state.filterOpen }

        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
        
        case 'SELECTED_SORT':
            const selectedSort = payload.id;
            const sortedArticles = sortQuery('articles', state.filteredArticles, selectedSort);
            
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                filteredArticles: sortedArticles
            }
        
        case 'RESET_FILTER':
            return { 
                ...state,
                filteredArticles: payload,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: '',
                isError: false,
                error: null,                
            }

        case 'FILTER_QUERY':
            const filterType = payload.name;
            const selectedType = payload.value;
            return {
                ...state,
                [filterType]: selectedType,
                isError: false,
                error: null,
            }

        case 'SEARCH_ARTICLES':
            const { filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(payload, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(payload, filterOption, filterQuery);

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
                    filteredArticles: filteredContent,
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
        
        case 'SELECTED_ARTICLE':
            const selectedArticle = payload.listOfArticles.find(article => article.id.toString() === payload.selected.id);
            return { 
                ...state, 
                articleOpen: true, 
                selectedArticle
            }
        
        case 'SEARCH_QUERY':
            const searchQuery = payload.value;
            return { ...state, searchQuery }

        case 'CHANGE_PAGE':
            const currentPage = payload;
            return { ...state, currentPage }
                    
        default:
    }
}

function ArticleBoard(props) {
    const { classes, history, listOfArticles } = props;
    const match = useRouteMatch();

    const INITIAL_STATE = {
        filteredArticles: [],   
        selectedArticle: null,
        articleOpen: false,
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
    const { filteredArticles, articleOpen, selectedArticle, composeOpen, anchorOpen, selectedAnchor, isFiltered, filterOpen, filterOption, filterConjunction, filterQuery, searchQuery, currentPage, articlesPerPage, error, isError } = state;
    const filterProps = { filterOpen, filterOption, filterConjunction, filterQuery, error, isError }

    const totalPages = Math.ceil(filteredArticles.length/articlesPerPage);
    const paginatedArticles = createPagination(filteredArticles, currentPage, articlesPerPage, totalPages);
    
    // E V E N T  L I S T E N E R S
    const handlePageChange = newPage => dispatch({ type:'CHANGE_PAGE', payload: newPage });

    const handleSelectedArticle = event => dispatch({ type: 'SELECTED_ARTICLE', payload: { selected: event.currentTarget, listOfArticles }});
    
    const toggleComposeDialog = () => dispatch({ type:'TOGGLE_COMPOSE' });

    const openSortPopover = event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget });
    const handleSelectedSort = event => dispatch({ type: 'SELECTED_SORT', payload: event.currentTarget});

    const handleSearchQuery = event => dispatch({ type: 'SEARCH_QUERY', payload: event.target });
    const handleSearch = () => dispatch({ type:'SEARCH_ARTICLES', payload: listOfArticles });

    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER' });
    const handleFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload: event.target });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: listOfArticles });

    useEffect(() => {
        dispatch({ type:'LOAD_ARTICLES', payload: listOfArticles });
    }, [listOfArticles])

    return (
        <section className={classes.root}>
            <Container>
                <Switch>
                <Route path={`${match.path}/:articleID`}>
                    <AuthUserContext.Consumer>
                        {authUser => 
                            <Article 
                                article={selectedArticle}
                                authUser={authUser} 
                                history={history}
                                articleOpen={articleOpen} 
                            /> 
                        }
                    </AuthUserContext.Consumer>
                </Route>
                <Route path={match.path}>
                    <AuthUserContext.Consumer>
                        {authUser => authUser &&
                            <>
                                <Compose handleComposeClick={toggleComposeDialog}/> 
                                <ComposeDialog
                                    isEdit={false}
                                    authUser={authUser} 
                                    composeType='article'
                                    composeOpen={composeOpen} 
                                    onClose={toggleComposeDialog} />
                            </>
                        }
                    </AuthUserContext.Consumer>
                    <Filter 
                        isFilter={isFiltered} 
                        handleFilterClick={toggleFilterDialog} 
                        handleFilterReset={resetFilter}/>

                    <Sort 
                        selectedAnchor={selectedAnchor}
                        handleSortClick={openSortPopover}/>

                    <SearchField 
                        handleSearch={handleSearchQuery}
                        handleSearchClick={() => history.push({pathname:'/search', search:`?query=${searchQuery}`, state: {...state, resources: listOfArticles} })}/>

                    <FilterDialog
                        {...filterProps}
                        handleSearchQuery={handleFilterQuery}
                        handleSearchClick={handleSearch} 
                        onClose={toggleFilterDialog} />

                    <SortPopover 
                        anchorEl={anchorOpen} 
                        open={Boolean(anchorOpen)} 
                        onClose={handleSelectedSort}/>

                    <Grid container>
                        {paginatedArticles.map(article => {
                            const redirectPath = { pathname: `${match.path}/${article.id}`, state: { title: 'Networking' } }
                            return (
                                <Grid key={article.id} item xs={12} md={3} className={classes.background}>
                                    <div className={classes.item} id={article.id} onClick={handleSelectedArticle}>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to={redirectPath}
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
                        )})}
                    </Grid>
                    <Pagination 
                        totalPages={totalPages}
                        currentPage={currentPage} 
                        resourcesPerPage={articlesPerPage}
                        handlePageChange={(event, newPage) => handlePageChange(newPage)}
                    />
                    </Route>
                </Switch>
            </Container>
        </section>
    );
}

export default withStyles(styles)(ArticleBoard);