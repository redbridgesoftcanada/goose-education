import React, { useReducer, useEffect, useState, useRef } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format, compareDesc } from 'date-fns';
import { AuthUserContext } from '../components/session';
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import Compose from '../components/ComposeButton';
import ComposeDialog from '../components/ComposeDialog';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SocialMediaButtons from '../components/SocialMediaButtons';
import Pagination from '../components/Pagination';

const title = 'Announcement Board';
const description = 'Check out the latest news from Goose!';

const INITIAL_STATE = {
    filteredAnnounces: [],
    composeOpen: false,
    anchorOpen: null,
    selectedAnchor: '',
    isFiltered: false,
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: ''
}

export default function AnnouncementBoard(props) {
    const { setAnnounce, listOfAnnouncements } = props;
    const match = useRouteMatch();
    
    const [ error, setError ] = useState(null);
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { filteredAnnounces, composeOpen, anchorOpen, selectedAnchor, isFiltered } = state;
    
    // Pagination
    const paginateRef = useRef(null);
    const [ paginate, setPaginate ] = useState({ currentPage: 0, pageLimit: 5 });
    paginateRef.current = createPagination(filteredAnnounces, paginate.currentPage, paginate.pageLimit);

    // Filter
    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER', payload: setError });
    const handleFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload: event.target });
    const handleFilterSearch = () => dispatch({ type:'FILTER_ANNOUNCEMENTS', payload: { listOfAnnouncements, setError } });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: { listOfAnnouncements, setError } });

    // Sort
    const openSortPopover = event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget });
    const handleSelectedSort = event => dispatch({ type: 'SELECTED_SORT', payload: event.currentTarget});
    
    // Dialog
    const toggleComposeDialog = () => dispatch({ type:'TOGGLE_COMPOSE' });

    useEffect(() => {
        dispatch({ type: 'LOAD_ANNOUNCEMENTS', payload: listOfAnnouncements })
    }, [listOfAnnouncements]);

    // Δ filteredArticles (sort, filter); 
    useEffect(() => {
        paginateRef.current = createPagination(state.filteredAnnounces, paginate.currentPage, paginate.pageLimit);
    }, [state.filteredAnnounces, paginate.currentPage, paginate.pageLimit]);

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            
            <AuthUserContext.Consumer>
                {authUser => (authUser && authUser.roles['admin']) &&
                    <>
                        <Compose handleComposeClick={toggleComposeDialog}/> 
                        <ComposeDialog
                            isEdit={false}
                            authUser={authUser} 
                            composeType='announce'
                            composeOpen={composeOpen} 
                            onClose={toggleComposeDialog} />
                    </>
                }
            </AuthUserContext.Consumer>
            
            <Filter  
                isFilter={isFiltered} 
                handleFilterClick={toggleFilterDialog} 
                handleFilterReset={resetFilter}/>
            
            <FilterDialog  
                filterOpen={state.filterOpen}
                filterOption={state.filterOption}
                filterConjunction={state.filterConjunction}
                error={error}
                handleSearchQuery={handleFilterQuery}
                handleSearchClick={handleFilterSearch} 
                onClose={toggleFilterDialog}/>

            <Sort 
                selectedAnchor={selectedAnchor}
                handleSortClick={openSortPopover}/>

            <SortPopover
                anchorEl={anchorOpen} 
                open={Boolean(anchorOpen)} 
                onClose={handleSelectedSort}/>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginateRef.current.map(announce => {
                        const redirectPath = { pathname: `${match.path}/announcement/${announce.id}`, state: { title: 'Service Centre', tab: 0 } }
                        return (
                            <TableRow hover key={announce.id} id={announce.id} onClick={setAnnounce}>
                                <TableCell align='center'>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to={redirectPath}
                                    >
                                        {announce.title}
                                    </Link>
                                </TableCell>
                                <TableCell align='center'>{announce.authorDisplayName}</TableCell>
                                <TableCell align='center'>  {format([announce.createdAt, announce.updatedAt].sort(compareDesc).pop(), 'P')}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination 
                count={state.filteredAnnounces.length}
                currentPage={paginate.currentPage} 
                resourcesPerPage={paginate.pageLimit}
                handlePageChange={(event, newPage) => setPaginate(prevState => ({...prevState, currentPage: newPage}))}/>
        </Container>
    )
}

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'LOAD_ANNOUNCEMENTS': 
            return { ...state, filteredAnnounces: payload }

        case 'CHANGE_PAGE':
            return { ...state, currentPage: payload }

        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
            
        case 'TOGGLE_COMPOSE':
            return { ...state, composeOpen: !state.composeOpen }

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

        case 'FILTER_ANNOUNCEMENTS':
            const { filterOption, filterConjunction, filterQuery } = state;
            const { listOfAnnouncements, setError } = payload;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(listOfAnnouncements, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(listOfAnnouncements, filterOption, filterQuery);

            } else {
                setError('Please enter one or more filter terms');
                return { ...state }
            }

            if (filteredContent.length) {
                return {
                    ...state,
                    filteredAnnounces: filteredContent,
                    isFiltered: true,
                    filterOpen: false
                }
            } else {
                setError('Sorry, no matches found!');
                return { ...state }
            }
        
        case 'RESET_FILTER': {
            const { listOfAnnouncements, setError } = payload;
            setError(null);
            return { 
                ...state,
                filteredAnnounces: listOfAnnouncements,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: ''            
            }
        }
        
        case 'SELECTED_SORT':
            const selectedSort = payload.id;
            const sortedAnnouncements = sortQuery('announcements', state.filteredAnnounces, selectedSort);
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                filteredAnnounces: sortedAnnouncements
            }
        
        default:
    }
}