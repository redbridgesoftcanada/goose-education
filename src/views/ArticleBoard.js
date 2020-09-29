import React, { Fragment, useEffect, useState, useReducer, useRef } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { CardContent, CardMedia, Container, Grid, Link, Typography } from '@material-ui/core';
import { Switch, Redirect, Route, Link as RouterLink, useRouteMatch, useHistory, useLocation } from "react-router-dom";
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
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
import { useStyles } from '../styles/networking';

const INITIAL_STATE = {
    filteredArticles: [],
    selectedArticle: null,
    composeOpen: false,   
    anchorOpen: null,     
    selectedAnchor: '',
    isFiltered: false,    
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: ''
}

export default function ArticleBoard({ listOfArticles }) {
    const classes = useStyles();
    const history = useHistory();
    const match = useRouteMatch();
    const location = useLocation();

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const [ error, setError ] = useState(null);
    
    const { selectedArticle, composeOpen, anchorOpen, selectedAnchor, isFiltered, searchQuery } = state;
    
    // Pagination
    const [ paginate, setPaginate ] = useState({ currentPage: 0, pageLimit: 5 });
    const paginateRef = useRef(null);
    paginateRef.current = createPagination(state.filteredArticles, paginate.currentPage, paginate.pageLimit);

    // Filter
    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER', payload: setError });
    const handleFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload: event.target});
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: { listOfArticles, setError } });

    // Sort
    const handleSelectedSort = event => dispatch({ type: 'SELECTED_SORT', payload: event.currentTarget});
    const openSortPopover = event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget });

    // Search
    const handleSearchQuery = event => dispatch({ type: 'SEARCH_QUERY', payload: event.target});
    const handleSearch = () => dispatch({ type:'SEARCH_ARTICLES', payload: { listOfArticles, setError } });

    // Dialog
    const handleSelectedArticle = event => dispatch({ type: 'SELECTED_ARTICLE', payload: { selected: event.currentTarget, listOfArticles }});
    const toggleComposeDialog = () => dispatch({ type:'TOGGLE_COMPOSE' });

    useEffect(() => {
        if (location.state && location.state.article) {
            dispatch({ type: 'SELECTED_ARTICLE', payload: { selected: location.state.article, listOfArticles }});
        } 
        dispatch({ type:'LOAD_ARTICLES', payload: listOfArticles });
    }, [location.state, listOfArticles])

    // Δ filteredArticles (sort, filter); 
    useEffect(() => {
        paginateRef.current = createPagination(state.filteredArticles, paginate.currentPage, paginate.pageLimit);
    }, [state.filteredArticles, paginate.currentPage, paginate.pageLimit]);

    return (
        <Container className={classes.root}>
            <Switch>

                {selectedArticle &&
                    <AuthUserContext.Consumer>
                    {authUser => 
                        <>
                            <Redirect to={{                   
                                pathname: `${match.path}/${selectedArticle.id}`, 
                                state: {
                                    title: 'Networking',
                                    selected: 0
                                }
                            }}/>

                            <Article 
                                authUser={authUser}
                                article={selectedArticle} 
                            /> 
                        </>
                    }
                    </AuthUserContext.Consumer>
                }

                <Route path={`${match.path}/:articleID`}>
                    <AuthUserContext.Consumer>
                        {authUser => 
                            <Article 
                                article={selectedArticle}
                                authUser={authUser}/> 
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
                        handleSearchClick={() => history.push({pathname:'/search', search:`?query=${searchQuery}`, state: {...state, category: 'Networking', resources: listOfArticles} })}/>

                    <FilterDialog
                        filterOpen={state.filterOpen}
                        filterOption={state.filterOption}
                        filterConjunction={state.filterConjunction}
                        error={error}
                        handleSearchQuery={handleFilterQuery}
                        handleSearchClick={handleSearch} 
                        onClose={toggleFilterDialog} />

                    <SortPopover 
                        anchorEl={anchorOpen} 
                        open={Boolean(anchorOpen)} 
                        onClose={handleSelectedSort}/>

                    <Grid container className={classes.board} spacing={1}>
                        {paginateRef.current.map(article => {
                            const redirectPath = { 
                                pathname: `${match.path}/${article.id}`, 
                                state: { title: 'Networking' } 
                            }
                            return (
                                <Grid item xs={12} sm={6} md={4} 
                                    onClick={handleSelectedArticle}
                                    key={article.id}
                                    id={article.id}>
                                    <Link className={classes.article}
                                        component={RouterLink} 
                                        to={redirectPath}>
                                        <CardMedia
                                            className={classes.articleThumbnail}
                                            image={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)}
                                            title="article-thumbnail"/>
                                        <CardContent>
                                            <Typography className={classes.articleTitle} >
                                                {article.title}
                                            </Typography>
                                            <Typography noWrap className={classes.articleDescription}>
                                                {parse(article.description, {
                                                    replace: ({ name, children }) => 
                                                        (name === 'p') && <Fragment>{domToReact(children)}</Fragment>
                                                })}
                                            </Typography>
                                        </CardContent>
                                    </Link>
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Pagination 
                        count={state.filteredArticles.length}
                        currentPage={paginate.currentPage} 
                        resourcesPerPage={paginate.pageLimit}
                        handlePageChange={(event, newPage) => setPaginate(prevState => ({...prevState, currentPage: newPage}))}/>
                </Route>
            </Switch>
        </Container>
    );
}

function toggleReducer(state, action) {
    const { type, payload } = action;
  
    switch(type) {
        case 'LOAD_ARTICLES': 
            return { ...state, filteredArticles: payload }

        case 'TOGGLE_COMPOSE':
            return { ...state, composeOpen: !state.composeOpen }

        case 'TOGGLE_FILTER': {
            (!state.filterOpen === false) && payload(null);
            return { ...state, filterOpen: !state.filterOpen }
        }

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
        
        case 'RESET_FILTER': {
            const { listOfArticles, setError } = payload;
            setError(null);
            return { 
                ...state,
                filteredArticles: listOfArticles,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: ''              
            }
        }

        case 'FILTER_QUERY':
            const filterType = payload.name;
            const selectedType = payload.value;
            return { ...state, [filterType]: selectedType }

        case 'SEARCH_ARTICLES':
            const { filterOption, filterConjunction, filterQuery } = state;
            const { listOfArticles, setError } = payload;
            
            let filteredContent = [];
            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(listOfArticles, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(listOfArticles, filterOption, filterQuery);

            } else {
                setError('Please enter one or more filter terms');
                return { ...state }
            }

            if (filteredContent.length) {
                return {
                    ...state,
                    filteredArticles: filteredContent,
                    isFiltered: true,
                    filterOpen: false
                }
            } else {
                setError('Sorry, no matched found!');
                return { ...state }
            }

        case 'SELECTED_ARTICLE':
            const selectedArticle = payload.listOfArticles.find(article => article.id.toString() === payload.selected.id);
            return { ...state, selectedArticle }
        
        case 'SEARCH_QUERY':
            const searchQuery = payload.value;
            return { ...state, searchQuery }

        case 'CHANGE_PAGE':
            const currentPage = payload;
            return { ...state, currentPage }
                    
        default:
            console.log('No matching dispatch type for ArticleBoard.')
            return;
    }
}