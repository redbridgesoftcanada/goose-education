import React, { useReducer, useEffect } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format } from 'date-fns';

import { singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers';
import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SocialMediaButtons from '../components/SocialMediaButtons';
import Pagination from '../components/Pagination';

const title = 'Announcement Board';
const description = 'Check out the latest news from Goose!';

const styles = theme => ({
    wrapper: {
        marginTop: theme.spacing(3),
    },
});

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'LOAD_ANNOUNCEMENTS': 
            return { ...state, announcements: payload }

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

        case 'FILTER_ANNOUNCEMENTS':
            const { announcements, filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(announcements, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(announcements, filterOption, filterQuery);

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
                    announcements: filteredContent,
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
                announcements: payload,
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
            const sortedAnnouncements = sortQuery('announcements', state.announcements, selectedSort);
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                announcements: sortedAnnouncements
            }

        case 'CHANGE_PAGE':
            const currentPage = payload;
            return { ...state, currentPage }
    }
}

function AnnouncementBoard({classes, handleClick, listOfAnnouncements}) {
    const INITIAL_STATE = {
        announcements: [],
        composeOpen: false,
        anchorOpen: null,
        selectedAnchor: '',
        isFiltered: false,
        filterOpen: false,
        filterOption: 'Title',
        filterConjunction: 'And',
        filterQuery: '',
        currentPage: 0,
        announcesPerPage: 10,
        isError: false,
        error: null
    }

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { announcements, filterOpen, anchorOpen, selectedAnchor, isFiltered, filterOption, filterConjunction, filterQuery, currentPage, announcesPerPage, error, isError } = state;
    const filterProps = { filterOpen, filterOption, filterConjunction, filterQuery, error, isError }
    const match = useRouteMatch();

    const totalAnnouncements = listOfAnnouncements.length;
    const totalPages = Math.ceil(totalAnnouncements / announcesPerPage);
    const indexOfLastAnnouncement = (currentPage * announcesPerPage) + 1;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcesPerPage;
    const paginatedAnnouncements = (totalPages > 1) ? announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement) : announcements;

    useEffect(() => {
        dispatch({ type: 'LOAD_ANNOUNCEMENTS', payload: listOfAnnouncements })
    }, [listOfAnnouncements]);

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            <div className={classes.wrapper}>
                <Filter  
                isFilter={isFiltered} 
                handleFilterClick={() => dispatch({type: 'OPEN_FILTER'})} 
                handleFilterReset={() => dispatch({type: 'RESET_FILTER', payload: listOfAnnouncements})}/>
                <Sort 
                selectedAnchor={selectedAnchor}
                handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
            </div>
            <FilterDialog  
                filterProps={filterProps}
                handleSearchQuery={event => dispatch({type:'FILTER_QUERY', payload: event.target})}
                handleSearchClick={() => dispatch({type:'FILTER_ANNOUNCEMENTS'})} 
                onClose={() => dispatch({ type: 'CLOSE_FILTER' })}/>
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
                    {paginatedAnnouncements.map(announcement => {
                        return (
                            <TableRow hover key={announcement.id} id={announcement.id} onClick={handleClick}>
                                <TableCell align='center'>
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        component={RouterLink} 
                                        to=
                                        {{
                                            pathname: `${match.path}/announcement/${announcement.id}`, 
                                            state: {
                                                title: 'Service Centre',
                                                selected: 0,
                                            }
                                        }}
                                    >
                                        {announcement.title}
                                    </Link>
                                </TableCell>
                                <TableCell align='center'>{announcement.author}</TableCell>
                                <TableCell align='center'> {(announcement.updatedAt > announcement.createdAt) ? format(announcement.updatedAt, 'yyyy-MM-dd') : format(announcement.createdAt, 'yyyy-MM-dd')}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination 
            totalPages={totalPages}
            currentPage={currentPage} 
            resourcesPerPage={announcesPerPage}
            handlePageChange={(event, newPage) => dispatch({type:'CHANGE_PAGE', payload: newPage})}
            />
        </Container>
    )
}

export default withStyles(styles)(AnnouncementBoard);