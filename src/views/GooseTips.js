import React, { useReducer, useEffect } from 'react';
import { Container, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core';
import { AuthUserContext } from '../components/session';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchField from '../components/SearchField';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';
import { singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers';

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    image: {
        display: 'block',
        border: 0,
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0 auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3, 5),
        textAlign: 'left',
        "&:hover": {
            cursor: 'pointer',
        },
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1, 0),
    },
    articleTitle: {
        fontWeight: 700,
    },
    articleDescription: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '23em',
    },
    search: {
        float: 'right',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: 5,
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
    badge: {
        backgroundColor: 'rgb(240, 150, 20)',
        color: theme.palette.common.white,
        padding: 3,
        width: '4em',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'DEFAULT_TIPS': 
            return { ...state, gooseTips: payload }

        case 'TOGGLE_FILTER':
            return { ...state, filterOpen: !state.filterOpen }

        case 'FILTER_QUERY':
            const filterType = payload.name;
            const selectedType = payload.value;
            return {
                ...state,
                [filterType]: selectedType,
                isError: false,
                error: null,
            }

        case 'FILTER_TIPS':
            const gooseTips = payload;
            const { filterOption, filterConjunction, filterQuery } = state;
            
            let filteredContent = [];
            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(gooseTips, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(gooseTips, filterOption, filterQuery);

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
                    gooseTips: filteredContent,
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
                gooseTips: payload,
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
            const sortedTips = sortQuery('articles', state.gooseTips, selectedSort);

            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                gooseTips: sortedTips
            }

        case 'SEARCH_QUERY':
            const searchQuery = payload.value;
            return { ...state, searchQuery }
        
        case 'OPEN_TIP':
            let selectedTip = state.gooseTips.find(tip => tip.id.toString() === payload.id);
            return { 
                ...state, 
                selectedTip,
                tipOpen: true, 
            }
        
        case 'CLOSE_TIP':
            return { 
                ...state,
                selectedTip: null,
                tipOpen: false }
        
        case 'CHANGE_PAGE':
            const currentPage = payload;
            return { ...state, currentPage }
    }
}

function GooseTips(props) {
    const { classes, history } = props;
    
    const INITIAL_STATE = {
        gooseTips: [],
        isError: false,
        error: null,
        isFiltered: false,
        filterOpen: false,
        filterOption: 'Title',
        filterConjunction: 'And',
        filterQuery: '',
        anchorOpen: null,
        selectedAnchor: '',
        tipOpen: false,
        selectedTip: null,
        searchQuery: '',
        currentPage: 0,
        tipsPerPage: 10
    }

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { gooseTips, isError, error, isFiltered, filterOpen, filterOption, filterConjunction, filterQuery, anchorOpen, selectedAnchor, tipOpen, selectedTip, searchQuery, currentPage, tipsPerPage } = state;
    const redirectPath = {
        pathname:'/search', 
        search: `?query=${searchQuery}`, 
        state: {...state, resources: gooseTips} 
    }

    // E V E N T  L I S T E N E R S

    // F i l t e r
    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER' });
    const createFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload:event.target });
    const handleFilterQuery = () => dispatch({ type:'FILTER_TIPS', payload: gooseTips });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: gooseTips });

    // S o r t
    const openSort = event => dispatch({ type:'OPEN_SORT', payload: event.currentTarget });
    const closeSort = event => dispatch({ type:'CLOSE_SORT', payload: event.currentTarget });
    
    // S e a r c h
    const createSearch = event => dispatch({ type: 'SEARCH_QUERY', payload: event.target });
    
    // T i p  D i a l o g 
    const openTipDialog = event => dispatch({ type:'OPEN_TIP', payload: event.currentTarget });
    const closeTipDialog = () => dispatch({ type:'CLOSE_TIP' });
    
    // P A G I N A T I O N 
    const totalTips = gooseTips.length;
    const totalPages = Math.ceil(totalTips / tipsPerPage);
    const indexOfLastTip = (currentPage * tipsPerPage) + 1;
    const indexOfFirstTip = indexOfLastTip - tipsPerPage;
    const paginatedTips = (totalPages > 1) ? gooseTips.slice(indexOfFirstTip, indexOfLastTip) : gooseTips;
    const handlePageChange = (newPage) => dispatch({ type:'CHANGE_PAGE', payload: newPage });

    // listen for changes to props gooseTips and update local state
    useEffect(() => {
        dispatch({ type:'DEFAULT_TIPS', payload: props.gooseTips });
    }, [props.gooseTips])
    
    return (
        <section className={classes.root}>
            <Container>
                <Typography variant="h3" marked="center" className={classes.title}>Goose Tips</Typography>
                <Filter 
                    isFilter={isFiltered} 
                    handleFilterClick={toggleFilterDialog} 
                    handleFilterReset={resetFilter}
                />
                <Sort 
                    selectedAnchor={selectedAnchor}
                    handleSortClick={openSort}/>
                <SearchField 
                    handleSearch={createSearch}
                    handleSearchClick={() => history.push(redirectPath)}/>

                <FilterDialog
                    isError={isError} 
                    error={error}
                    filterOption={filterOption} 
                    filterConjunction={filterConjunction} 
                    filterQuery={filterQuery}
                    handleSearchQuery={createFilterQuery}
                    handleSearchClick={handleFilterQuery} 
                    filterOpen={filterOpen} 
                    onClose={toggleFilterDialog} 
                />
                <SortPopover anchorEl={anchorOpen} open={Boolean(anchorOpen)} onClose={closeSort}/>
                <AuthUserContext.Consumer>
                    { authUser => authUser &&
                        <ArticleDialog  
                        authUser={authUser} 
                        history={history}
                        articleOpen={tipOpen}
                        article={selectedTip}
                        onClose={closeTipDialog}/>
                    }
                </AuthUserContext.Consumer>

                { gooseTips.length ? 
                    <Grid container>
                        { paginatedTips.map(tip => {
                            return (
                                <Grid item xs={12} md={4} key={tip.id} className={classes.background}>
                                    <div id={tip.id} onClick={openTipDialog} className={classes.item}>
                                        <img
                                            className={classes.image}
                                            src={require(`../assets/img/${tip.image}`)}
                                            alt="tip-thumbnail"
                                        />
                                        <div className={classes.body}>
                                            {(tip.views > 100) ? <Typography className={classes.badge}>Hot</Typography> : ''}
                                            <Typography variant="body1" className={classes.articleTitle}>
                                                {tip.title}
                                            </Typography>
                                            <Typography noWrap variant="body2" className={classes.articleDescription}>
                                                {tip.description}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        }) }
                    </Grid>
                    : 
                    <LinearProgress color='secondary'/>
                    }
                    <Pagination 
                    totalPages={totalPages}
                    currentPage={currentPage} 
                    resourcesPerPage={tipsPerPage}
                    handlePageChange={(event, newPage) => handlePageChange(newPage)}
                    />
            </Container>
        </section>
    );
}

export default withStyles(styles)(GooseTips);