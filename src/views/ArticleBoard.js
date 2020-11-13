import React, { Fragment, useEffect, useState, useRef, useContext, useCallback } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { CardContent, CardMedia, Container, Grid, Link, Typography } from '@material-ui/core';
import { Switch, Redirect, Route, Link as RouterLink, useRouteMatch, useHistory } from "react-router-dom";
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import debounce from '../constants/helpers/_debounce';
import { AuthUserContext } from '../components/session';
import { StateContext, DispatchContext } from '../components/userActions';
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

export default function ArticleBoard({ selectedTab, filterReset }) {
    const authUser = useContext(AuthUserContext);
    const { dispatch } = useContext(DispatchContext);
    const state = useContext(StateContext);
    
    // display error warnings for invalid filter values;
    const [ error, setError ] = useState(null);
    const { 
        currentPage, 
        pageLimit,
        articles,
        articleSelect, 
        composeOpen, 
        anchorOpen, 
        anchorSelect, 
        isFiltered,
        filterOpen,
        filterOption, 
        filterConjunction, 
        filterQuery 
    } = state;
    
    const paginateRef = useRef();
    paginateRef.current = createPagination(articles[selectedTab], currentPage, pageLimit);

    const setCurrentPage = (event, newValue) => dispatch({ type: 'setCurrentPage', payload: newValue });

    const toggleComposeDialog = () => dispatch({ type:'composeToggle' });

    const toggleFilter = () => {
        (!state.filterOpen === false ) && setError(null);
        dispatch({ type: 'filterToggle' });
    }

    const setFilterCategory = event => {
        const category = event.target.name;
        const input = event.target.value;
        dispatch({ type:'filterCategory', payload: { category, input } });
    }
    
    const resetFilter = () => {
        setError(null);
        filterReset();
    }

    const toggleSort = event => dispatch({ type: 'sortToggle', payload: event.currentTarget });

    const setSort = event => {
        const category = event.currentTarget.id;
        const sortedArticles = sortQuery('articles', articles[selectedTab], category);

        dispatch({ type: 'setSort', payload: { category, sortedArticles, selectedTab } });
    }
    
    const inputDebounce = useCallback(
        debounce(value => dispatch({ type: 'filterText', payload: value }), 500));

    const setFilterText = event => inputDebounce(event.target.value);

    const toggleSearch = () => {
        let filteredContent = [];
        if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
            filteredContent = multipleFilterQuery(articles[selectedTab], filterOption, filterConjunction, filterQuery);

        } else if (Boolean(filterQuery)) {
            filteredContent = singleFilterQuery(articles[selectedTab], filterOption, filterQuery);

        } else {
            setError('Please enter one or more filter terms');
        }

        if (!filteredContent.length) {
            setError('Sorry, no matches found!');
        } else {
            dispatch({ type:'setFilteredArticles', payload: { selectedTab, filteredContent } });
        }
    }

    const setArticleSelect = event => {
        const articleData = articles[selectedTab].find(article => article.id.toString() === event.currentTarget.id);
        dispatch({ type: 'setArticle', payload: articleData });
    }

    // Δ filteredArticles (sort, filter); 
    useEffect(() => {
        paginateRef.current = createPagination(articles[selectedTab], currentPage, pageLimit);
    }, [articles, selectedTab, currentPage, pageLimit]);

    const history = useHistory();
    const match = useRouteMatch();
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <Switch>
                {articleSelect &&
                    <>
                        <Redirect to={{                   
                            pathname: `${match.path}/${articleSelect.id}`, 
                            state: { selected: 0 }
                        }}/>

                        <Article/> 
                    </>
                }

                <Route path={`${match.path}/:articleID`}>
                    <Article/> 
                </Route>
                
                <Route path={match.path}>
                    {authUser &&
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
                    
                    <Filter 
                        isFilter={isFiltered} 
                        handleFilterClick={toggleFilter} 
                        handleFilterReset={resetFilter}/>

                    <Sort 
                        selectedAnchor={anchorSelect}
                        handleSortClick={toggleSort}/>

                    <SearchField 
                        handleSearch={setFilterText}
                        handleSearchClick={() => history.push({
                            pathname:'/search', 
                            search:`?query=${filterQuery}`, 
                            state: { 
                                ...state, 
                                category: 'Networking', 
                                resources: articles[selectedTab] 
                            } 
                        })
                    }/>

                    <FilterDialog
                        filterOpen={filterOpen}
                        filterOption={filterOption}
                        filterConjunction={filterConjunction}
                        error={error}
                        handleSearchQuery={setFilterCategory}
                        handleSearchText={setFilterText}
                        handleSearchClick={toggleSearch}
                        onClose={toggleFilter} />

                    <SortPopover 
                        anchorEl={anchorOpen} 
                        open={Boolean(anchorOpen)} 
                        onClose={setSort}/>

                    <Grid container className={classes.board} spacing={1}>
                        {paginateRef.current.map(article => {
                            return (
                                <Grid item xs={12} sm={6} md={4} 
                                    onClick={setArticleSelect}
                                    key={article.id}
                                    id={article.id}>
                                    <Link className={classes.article}
                                        component={RouterLink} 
                                        to={{ 
                                            pathname: `${match.path}/${article.id}`, 
                                            state: { title: 'Networking' } 
                                        }}>
                                        <CardMedia
                                            className={classes.articleThumbnail}
                                            image={article.image}
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
                        count={articles[selectedTab].length}
                        currentPage={currentPage} 
                        resourcesPerPage={pageLimit}
                        handlePageChange={setCurrentPage}/>
                </Route>
            </Switch>
        </Container>
    );
}