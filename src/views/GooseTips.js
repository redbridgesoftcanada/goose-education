import React, { useReducer, useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, CardMedia, CardContent, Container, Grid, Typography } from '@material-ui/core';
import MarkedTypography from '../components/onePirate/Typography';
import FilterButton from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import SortButton from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchField from '../components/SearchField';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import useStyles from '../styles/goose';

const INITIAL_STATE = {
    gooseTips: [],
    isFiltered: false,
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: '',
    anchorOpen: null,
    selectedAnchor: '',
    tipOpen: false,
    selectedTip: null,
    searchQuery: ''
}

export default function GooseTips(props) {
    const classes = useStyles(props, 'tips');
    const history = useHistory();
    const location = useLocation();

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const [ error, setError ] = useState(null);

    const { gooseTips, isFiltered, anchorOpen, selectedAnchor, tipOpen, selectedTip, searchQuery } = state;

    // Pagination 
    const [ paginate, setPaginate ] = useState({ currentPage: 0, pageLimit: 5 });
    const paginateRef = useRef(null);
    paginateRef.current = createPagination(state.gooseTips, paginate.currentPage, paginate.pageLimit);

    // Filter
    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER', payload: setError });
    const createFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload:event.target });
    const handleFilterQuery = () => dispatch({ type:'FILTER_TIPS', payload: {gooseTips, setError } });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: {gooseTips: props.tips, setError } });

    // Sort
    const openSort = event => dispatch({ type:'OPEN_SORT', payload: event.currentTarget });
    const closeSort = event => dispatch({ type:'CLOSE_SORT', payload: event.currentTarget });
    
    // Search
    const createSearch = event => dispatch({ type: 'SEARCH_QUERY', payload: event.target });
    
    // Tip Dialog 
    const openTipDialog = event => dispatch({ type:'OPEN_TIP', payload: event.currentTarget });
    const closeTipDialog = () => dispatch({ type:'CLOSE_TIP' });

    // listen for changes to props gooseTips and update local state
    useEffect(() => {
        dispatch({ type:'DEFAULT_TIPS', payload: props.tips });
    }, [props.tips]);

    useEffect(() => {
        location.state.selectedTip && dispatch({ type:'OPEN_TIP', payload: location.state.selectedTip });
    }, [location.state.selectedTip]);

    // Δ filteredArticles (sort, filter); 
    useEffect(() => {
        paginateRef.current = createPagination(state.gooseTips, paginate.currentPage, paginate.pageLimit);
    }, [state.gooseTips, paginate.currentPage, paginate.pageLimit]);
    
    return (
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
                handleSearchClick={() => history.push({
                    pathname:'/search', 
                    search: `?query=${searchQuery}`, 
                    state: {...state, category: 'Tips', resources: gooseTips} 
                })}/>
           
            <FilterDialog
                filterOpen={state.filterOpen}
                filterOption={state.filterOption}
                filterConjunction={state.filterConjunction}
                error={error}
                handleSearchQuery={createFilterQuery}
                handleSearchClick={handleFilterQuery} 
                onClose={toggleFilterDialog} 
            />
           
            <SortPopover 
                anchorEl={anchorOpen} 
                open={Boolean(anchorOpen)} 
                onClose={closeSort}/>


            <ArticleDialog  
                articleOpen={tipOpen}
                article={selectedTip}
                onClose={closeTipDialog}/>

            {gooseTips.length ? 
                <Grid container spacing={1} className={classes.board}>
                    {paginateRef.current.map(tip => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={tip.id}>
                                <Box className={classes.tip} id={tip.id} onClick={openTipDialog}>
                                    <CardMedia
                                        className={classes.tipThumbnail}
                                        image={(tip.image.includes('firebase')) ? tip.image : require(`../assets/img/${tip.image}`)}
                                        title='Goose tip thumbnail'
                                    />
                                    <CardContent>
                                        <Typography variant='subtitle2'>
                                            {tip.title}
                                        </Typography>
                                        <Typography noWrap variant='body2'>
                                            {tip.description}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Grid>
                        )}) 
                    }
                </Grid>
                : 
                <Typography>There are no tips at this time. Please check again at a later time.</Typography>
            }

            <Pagination 
                count={state.gooseTips.length}
                currentPage={paginate.currentPage} 
                resourcesPerPage={paginate.pageLimit}
                handlePageChange={(event, newPage) => setPaginate(prevState => ({...prevState, currentPage: newPage}))}/>

        </Container>
    );
}

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'DEFAULT_TIPS': 
            return { ...state, gooseTips: payload }

        case 'TOGGLE_FILTER': 
            (!state.filterOpen === false) && payload(null);
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
            const { gooseTips, setError } = payload;
            const { filterOption, filterConjunction, filterQuery } = state;
            
            let filteredContent = [];
            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(gooseTips, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(gooseTips, filterOption, filterQuery);

            } else {
                setError('Please enter one or more filter terms.');
                return { ...state }
            }

            if (filteredContent.length) {
                return {
                    ...state,
                    gooseTips: filteredContent,
                    isFiltered: true,
                    filterOpen: false
                }
            } else {
                setError('Sorry, no matches found!');
                return { ...state }
            }

        case 'RESET_FILTER': {
            const { gooseTips, setError } = payload;
            setError(null);
            return { 
                ...state,
                gooseTips,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: ''               
            }
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
