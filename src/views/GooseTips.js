import React, { useReducer, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Grid, LinearProgress, Typography } from '@material-ui/core';
import MarkedTypography from '../components/onePirate/Typography';
import { AuthUserContext } from '../components/session';
import FilterButton from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import SortButton from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchField from '../components/SearchField';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import useStyles from '../styles/goose';

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

        default:
    }
}

export default function GooseTips(props) {
    const classes = useStyles(props, 'tips');
    const history = useHistory();
    
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
    
    const filterProps = { filterOpen, filterOption, filterConjunction, filterQuery, error, isError }
    
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
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: props.tips });

    // S o r t
    const openSort = event => dispatch({ type:'OPEN_SORT', payload: event.currentTarget });
    const closeSort = event => dispatch({ type:'CLOSE_SORT', payload: event.currentTarget });
    
    // S e a r c h
    const createSearch = event => dispatch({ type: 'SEARCH_QUERY', payload: event.target });
    
    // T i p  D i a l o g 
    const openTipDialog = event => dispatch({ type:'OPEN_TIP', payload: event.currentTarget });
    const closeTipDialog = () => dispatch({ type:'CLOSE_TIP' });
    
    // P A G I N A T I O N 
    const totalPages = Math.ceil(gooseTips.length / tipsPerPage);
    const paginatedTips = createPagination(gooseTips, currentPage, tipsPerPage, totalPages);
    const handlePageChange = (newPage) => dispatch({ type:'CHANGE_PAGE', payload: newPage });


    // listen for changes to props gooseTips and update local state
    useEffect(() => {
        dispatch({ type:'DEFAULT_TIPS', payload: props.tips });
    }, [props.tips])
    
    return (
        <section className={classes.root}>
            <Container>
                <MarkedTypography variant="h3" marked="center" className={classes.title}>Goose Tips</MarkedTypography>
                <FilterButton 
                    isFilter={isFiltered} 
                    handleFilterClick={toggleFilterDialog} 
                    handleFilterReset={resetFilter}/>
                <SortButton 
                    selectedAnchor={selectedAnchor}
                    handleSortClick={openSort}/>
                <SearchField 
                    handleSearch={createSearch}
                    handleSearchClick={() => history.push(redirectPath)}/>
                <FilterDialog
                    {...filterProps}
                    handleSearchQuery={createFilterQuery}
                    handleSearchClick={handleFilterQuery} 
                    onClose={toggleFilterDialog} 
                />
                <SortPopover 
                    anchorEl={anchorOpen} 
                    open={Boolean(anchorOpen)} 
                    onClose={closeSort}/>
                <AuthUserContext.Consumer>
                    {authUser => 
                        <ArticleDialog  
                            authUser={authUser} 
                            history={history}
                            articleOpen={tipOpen}
                            article={selectedTip}
                            onClose={closeTipDialog}/>
                    }
                </AuthUserContext.Consumer>

                {gooseTips.length ? 
                    <Grid container>
                        {paginatedTips.map(tip => {
                            return (
                                <Grid item xs={12} sm={12} md={4} key={tip.id}>
                                    <div id={tip.id} onClick={openTipDialog} className={classes.item}>
                                        <img
                                            className={classes.image}
                                            src={(tip.image.includes('firebase')) ? tip.image : require(`../assets/img/${tip.image}`)}
                                            alt="tip-thumbnail"
                                        />
                                        <div className={classes.body}>
                                            <Typography className={classes.articleTitle}>
                                                {tip.title}
                                            </Typography>
                                            <Typography noWrap className={classes.articleDescription}>
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