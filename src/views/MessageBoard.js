import React, { useEffect, useReducer } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format } from 'date-fns';
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

const styles = theme => ({
    wrapper: {
        marginTop: theme.spacing(3),
    },
});

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'LOAD_MESSAGES': 
            return { ...state, filteredMessages: payload }

        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
        
        case 'CHANGE_PAGE':
            return { ...state, currentPage: payload }

        case 'TOGGLE_COMPOSE':
            return { ...state, composeOpen: !state.composeOpen }

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
            
        case 'FILTER_MESSAGES':
            const { filteredMessages, filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(filteredMessages, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(filteredMessages, filterOption, filterQuery);

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
                    filteredMessages: filteredContent,
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
                filteredMessages: payload,
                isFiltered: false,
                filterOpen: false,
                filterOption: 'Title',
                filterConjunction: 'And',
                filterQuery: '',
                isError: false,
                error: null,                
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

function MessageBoard(props) {
    const { classes, listOfMessages, setMessage } = props;

    const INITIAL_STATE = {
        filteredMessages: [],
        composeOpen: false,
        anchorOpen: null,
        selectedAnchor: '',
        isFiltered: false,
        filterOpen: false,
        filterOption: 'Title',
        filterConjunction: 'And',
        filterQuery: '',
        currentPage: 0,
        messagesPerPage: 10,
        isError: false,
        error: null
    }
    
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { filteredMessages, composeOpen, anchorOpen, selectedAnchor, isFiltered, filterOpen, filterOption, filterConjunction, filterQuery, currentPage, messagesPerPage, error, isError } = state;
    const filterProps = { filterOpen, filterOption, filterConjunction, filterQuery, error, isError }
    const match = useRouteMatch();

    // P A G I N A T I O N
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
    const paginatedMessages = createPagination(filteredMessages, currentPage, messagesPerPage, totalPages);

    // E V E N T  L I S T E N E R S
    const handlePageChange = newPage => dispatch({ type:'CHANGE_PAGE', payload: newPage });

    const toggleComposeDialog = () => dispatch({ type:'TOGGLE_COMPOSE' });

    const openSortPopover = event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget });
    const handleSelectedSort = event => dispatch({ type: 'SELECTED_SORT', payload: event.currentTarget});

    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER' });
    const handleFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload: event.target });
    const handleFilterSearch = () => dispatch({ type:'FILTER_MESSAGES', payload: listOfMessages });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: listOfMessages });

    useEffect(() => {
        dispatch({ type: 'LOAD_MESSAGES', payload: listOfMessages })
    }, [listOfMessages])

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            <div className={classes.wrapper}>
                <AuthUserContext.Consumer>
                    { authUser => authUser && 
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
            </div>

            <FilterDialog  
                {...filterProps}
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
                    {paginatedMessages.map(message => {
                        const redirectPath = { pathname: `${match.path}/message/${message.id}`, state: { title: 'Service Centre', selected: 1 } }
                        return (
                            <TableRow hover key={message.id} id={message.id} onClick={setMessage}>
                                <TableCell align='center'>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to={redirectPath}
                                    >
                                        {message.title}
                                    </Link>
                                </TableCell>
                                <TableCell align='center'>{message.authorDisplayName}</TableCell>
                                <TableCell align='center'>{(message.updatedAt > message.createdAt) ? format(message.updatedAt, 'Pp') : format(message.createdAt, 'Pp')}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination 
                totalPages={totalPages}
                currentPage={currentPage} 
                resourcesPerPage={messagesPerPage}
                handlePageChange={(event, newPage) => handlePageChange(newPage)}
            />
        </Container>
    )
}

export default withStyles(styles)(MessageBoard);