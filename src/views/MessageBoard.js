import React, { useEffect, useReducer } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format } from 'date-fns';

import { singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers';
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
            return { ...state, messages: payload }

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

        case 'FILTER_MESSAGES':
            const { messages, filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(messages, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(messages, filterOption, filterQuery);

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
                    messages: filteredContent,
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
                messages: payload,
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
            const sortedMessages = sortQuery('messages', state.messages, selectedSort);
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                messages: sortedMessages
            }
    }
}

function MessageBoard({classes, handleClick, messagesDB}) {
    const INITIAL_STATE = {
        messages: [],
        composeOpen: false,
        anchorOpen: null,
        selectedAnchor: '',
        isFiltered: false,
        filterOpen: false,
        filterOption: 'Title',
        filterConjunction: 'And',
        filterQuery: '',
        isError: false,
        error: null
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { messages, composeOpen, anchorOpen, selectedAnchor, isFiltered, filterOpen, filterOption, filterConjunction, filterQuery } = state;
    let match = useRouteMatch();

    useEffect(() => {
        dispatch({ type: 'LOAD_MESSAGES', payload: messagesDB })
    }, [messagesDB])

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            <div className={classes.wrapper}>
                <AuthUserContext.Consumer>
                    { authUser => authUser ? 
                    <>
                        <Compose handleComposeClick={() => dispatch({ type: 'OPEN_COMPOSE' })}/> 
                        <ComposeDialog 
                        authUser={authUser} 
                        composeType={match.url}
                        composeOpen={composeOpen} 
                        onClose={() => dispatch({ type: 'CLOSE_COMPOSE' })} />
                    </>
                    : '' }
                </AuthUserContext.Consumer>
                <Filter 
                 isFilter={isFiltered} 
                 handleFilterClick={() => dispatch({type: 'OPEN_FILTER'})} 
                 handleFilterReset={() => dispatch({type: 'RESET_FILTER', payload: messagesDB})}/>
                <Sort 
                selectedAnchor={selectedAnchor}
                handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
            </div>
            <FilterDialog  
                isError={state.isError}
                error={state.error}
                filterOption={filterOption} filterConjunction={filterConjunction} filterQuery={filterQuery}
                handleSearchQuery={event => dispatch({type:'FILTER_QUERY', payload: event.target})}
                handleSearchClick={() => dispatch({type:'FILTER_MESSAGES'})} 
                filterOpen={filterOpen} 
                onClose={() => dispatch({ type: 'CLOSE_FILTER' })}  
            />
            <SortPopover 
            anchorEl={anchorOpen} 
            open={Boolean(anchorOpen)} 
            onClose={event => dispatch({ type: 'CLOSE_SORT', payload: event.currentTarget})}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messages.map(message => {
                        return (
                            <TableRow hover key={message.id} id={message.id} onClick={handleClick}>
                                <TableCell align='center'>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to=
                                        {{
                                            pathname: `${match.path}/message/${message.id}`, 
                                            state: {
                                                title: 'Service Centre',
                                                selected: 1,
                                            }
                                        }}
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
            <Pagination />
        </Container>
    )
}

export default withStyles(styles)(MessageBoard);