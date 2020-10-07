import React, { useEffect, useState, useReducer, useRef } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format, compareAsc } from 'date-fns';
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import { AuthUserContext } from '../components/session';
import Compose from '../components/ComposeButton';
import ComposeDialog from '../components/ComposeDialog';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SocialMediaButtons from '../components/SocialMediaButtons';
import Pagination from '../components/Pagination';

const title = 'Study Abroad Counselling';
const description = 'We will respond to your inquiry within 24 hours.';

const INITIAL_STATE = {
    filteredMessages: [],
    composeOpen: false,
    anchorOpen: null,
    selectedAnchor: '',
    isFiltered: false,
    filterOpen: false,
    filterOption: 'Title',
    filterConjunction: 'And',
    filterQuery: ''
} 

export default function MessageBoard(props) {
    const match = useRouteMatch();
    const { listOfMessages, setMessage } = props;

    const [ error, setError ] = useState(null);
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { filteredMessages, composeOpen, anchorOpen, selectedAnchor, isFiltered } = state;

    // Pagination
    const paginateRef = useRef(null);
    const [ paginate, setPaginate ] = useState({ currentPage: 0, pageLimit: 5 });
    paginateRef.current = createPagination(filteredMessages, paginate.currentPage, paginate.pageLimit);

    // Filter
    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER', payload: setError });
    const handleFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload: event.target });
    const handleFilterSearch = () => dispatch({ type:'FILTER_MESSAGES', payload: { listOfMessages, setError } });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: { listOfMessages, setError }});

    // Sort
    const openSortPopover = event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget });
    const handleSelectedSort = event => dispatch({ type: 'SELECTED_SORT', payload: event.currentTarget});

    // Dialog
    const toggleComposeDialog = () => dispatch({ type:'TOGGLE_COMPOSE' });

    useEffect(() => {
        dispatch({ type: 'LOAD_MESSAGES', payload: listOfMessages })
    }, [listOfMessages]);

    // Δ filteredArticles (sort, filter); 
    useEffect(() => {
        paginateRef.current = createPagination(state.filteredMessages, paginate.currentPage, paginate.pageLimit);
    }, [state.filteredMessages, paginate.currentPage, paginate.pageLimit]);

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            
            <AuthUserContext.Consumer>
                {authUser => authUser && 
                    <>
                        <Compose handleComposeClick={toggleComposeDialog}/> 
                        <ComposeDialog
                        isEdit={false}
                        authUser={authUser} 
                        composeType='message'
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

            <FilterDialog  
                filterOpen={state.filterOpen}
                filterOption={state.filterOption}
                filterConjunction={state.filterConjunction}
                error={error}
                handleSearchQuery={handleFilterQuery}
                handleSearchClick={handleFilterSearch} 
                onClose={toggleFilterDialog} />

            <SortPopover 
                anchorEl={anchorOpen} 
                open={Boolean(anchorOpen)} 
                onClose={handleSelectedSort} />
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginateRef.current.map(message => {
                        const redirectPath = { pathname: `${match.path}/message/${message.id}`, state: { title: 'Service Centre', selected: 1 } }
                        return (
                            <TableRow hover key={message.id} id={message.id} onClick={setMessage}>
                                <TableCell align='center'>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to={redirectPath}>
                                        {message.title}
                                    </Link>
                                </TableCell>
                                <TableCell align='center'>{message.authorDisplayName}</TableCell>
                                <TableCell align='center'>{format([message.createdAt, message.updatedAt].sort(compareAsc).pop(), 'Pp')}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination 
                count={state.filteredMessages.length}
                currentPage={paginate.currentPage} 
                resourcesPerPage={paginate.pageLimit}
                handlePageChange={(event, newPage) => setPaginate(prevState => ({...prevState, currentPage: newPage}))}/>
        </Container>
    )
}

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'LOAD_MESSAGES': 
            return { ...state, filteredMessages: payload }

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
            
        case 'FILTER_MESSAGES':
            const { listOfMessages, setError } = payload;
            const { filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(listOfMessages, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(listOfMessages, filterOption, filterQuery);

            } else {
                setError('Please enter one or more filter terms');
                return { ...state }
            }

            if (filteredContent.length) {
                return {
                    ...state,
                    filteredMessages: filteredContent,
                    isFiltered: true,
                    filterOpen: false
                }
            } else {
                setError('Sorry, no matches found!');
                return { ...state }
            }
        
        case 'RESET_FILTER': {
            const { listOfMessages, setError } = payload;
            setError(null);
            return { 
                ...state,
                filteredMessages: listOfMessages,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: '',              
            }
        }
        
        case 'SELECTED_SORT':
            const selectedSort = payload.id;
            const sortedMessages = sortQuery('messages', state.filteredMessages, selectedSort);
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                filteredMessages: sortedMessages
            }
        
        default:
    }
}