import React, { useReducer, useEffect } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format } from 'date-fns';
import { AuthUserContext } from '../components/session';
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers';
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

const styles = theme => ({
    wrapper: {
        marginTop: theme.spacing(3),
    },
});

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
            const { filteredAnnounces, filterOption, filterConjunction, filterQuery } = state;
            let filteredContent = [];

            if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
                filteredContent = multipleFilterQuery(filteredAnnounces, filterOption, filterConjunction, filterQuery);

            } else if (Boolean(filterQuery)) {
                filteredContent = singleFilterQuery(filteredAnnounces, filterOption, filterQuery);

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
                    filteredAnnounces: filteredContent,
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
                filteredAnnounces: payload,
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
            const sortedAnnouncements = sortQuery('announcements', state.filteredAnnounces, selectedSort);
            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : '',
                filteredAnnounces: sortedAnnouncements
            }
    }
}

function AnnouncementBoard(props) {
    const { classes, setAnnounce, listOfAnnouncements } = props;
    const INITIAL_STATE = {
        filteredAnnounces: [],
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
    const { filteredAnnounces, composeOpen, filterOpen, anchorOpen, selectedAnchor, isFiltered, filterOption, filterConjunction, filterQuery, currentPage, announcesPerPage, error, isError } = state;
    const filterProps = { filterOpen, filterOption, filterConjunction, filterQuery, error, isError }
    const match = useRouteMatch();

    // P A G I N A T I O N
    const totalPages = Math.ceil(filteredAnnounces.length/announcesPerPage);
    const paginatedAnnounces = createPagination(filteredAnnounces, currentPage, announcesPerPage, totalPages);

    // E V E N T  L I S T E N E R S
    const handlePageChange = newPage => dispatch({ type:'CHANGE_PAGE', payload: newPage });

    const toggleComposeDialog = () => dispatch({ type:'TOGGLE_COMPOSE' });

    const openSortPopover = event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget });
    const handleSelectedSort = event => dispatch({ type: 'SELECTED_SORT', payload: event.currentTarget});

    const toggleFilterDialog = () => dispatch({ type:'TOGGLE_FILTER' });
    const handleFilterQuery = event => dispatch({ type:'FILTER_QUERY', payload: event.target });
    const handleFilterSearch = () => dispatch({ type:'FILTER_ANNOUNCEMENTS', payload: listOfAnnouncements });
    const resetFilter = () => dispatch({ type: 'RESET_FILTER', payload: listOfAnnouncements });

    useEffect(() => {
        dispatch({ type: 'LOAD_ANNOUNCEMENTS', payload: listOfAnnouncements })
    }, [listOfAnnouncements]);

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            <div className={classes.wrapper}>
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
                    {...filterProps}
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
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedAnnounces.map(announce => {
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
                                <TableCell align='center'> {(announce.updatedAt > announce.createdAt) ? format(announce.updatedAt, 'yyyy-MM-dd') : format(announce.createdAt, 'yyyy-MM-dd')}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination 
                totalPages={totalPages}
                currentPage={currentPage} 
                resourcesPerPage={announcesPerPage}
                handlePageChange={(event, newPage) => handlePageChange(newPage)}
            />
        </Container>
    )
}

export default withStyles(styles)(AnnouncementBoard);