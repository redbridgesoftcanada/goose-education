import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format, compareAsc } from 'date-fns';
import { AuthUserContext } from '../components/session';
import { StateContext, DispatchContext } from '../components/userActions';
import { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery } from '../constants/helpers/_features';
import debounce from '../constants/helpers/_debounce';
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

export default function AnnouncementBoard({ filterReset }) {
    const authUser = useContext(AuthUserContext);
    const { dispatch } = useContext(DispatchContext);
    const stateContext = useContext(StateContext);
    
    // display error warnings for invalid filter values;
    const [ error, setError ] = useState(null); 
    const { 
        currentPage, 
        pageLimit,
        announces, 
        composeOpen, 
        anchorOpen, 
        selectedAnchor, 
        isFiltered,
        filterOpen,
        filterOption, 
        filterConjunction, 
        filterQuery 
    } = stateContext;

    const paginateRef = useRef(null);
    paginateRef.current = createPagination(announces, currentPage, pageLimit);
    
    const setCurrentPage = (event, newValue) => dispatch({ type: 'setCurrentPage', payload: newValue });

    const setAnnounce = e => {
        const announceData = announces.find(announce => announce.id.toString() === e.currentTarget.id);
        dispatch({ type: 'setAnnounce', payload: announceData });
    }
    
    const toggleComposeDialog = () => dispatch({ type:'composeToggle' });

    const toggleSort = event => dispatch({ type: 'sortToggle', payload: event.currentTarget });

    const setSort = event => {
        const category = event.currentTarget.id;
        const sortedAnnounces = sortQuery('announces', announces, category);

        dispatch({ type: 'setSort', payload: { category, sortedAnnounces } });
    }

    const toggleFilter = () => {
        (!filterOpen === false ) && setError(null);
        dispatch({ type: 'filterToggle' });
    }

    const setFilterCategory = event => {
        const category = event.target.name;
        const input = event.target.value;
        dispatch({ type:'filterCategory', payload: { category, input } });
    }

    const inputDebounce = useCallback(debounce(value => 
        dispatch({ type: 'filterText', payload: value }), 500));

    const setFilterText = event => inputDebounce(event.target.value);
    
    const toggleSearch = () => {
        let filteredContent = [];
        if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
            filteredContent = multipleFilterQuery(announces, filterOption, filterConjunction, filterQuery);

        } else if (Boolean(filterQuery)) {
            filteredContent = singleFilterQuery(announces, filterOption, filterQuery);

        } else {
            setError('Please enter one or more filter terms');
        }

        if (!filteredContent.length) {
            setError('Sorry, no matches found!');
        } else {
            dispatch({ type:'setFilteredAnnounces', payload: filteredContent });
        }
    } 

    const resetFilter = () => {
        setError(null);
        filterReset();
    }

    // update pagination (sort, filter); 
    useEffect(() => {
        paginateRef.current = createPagination(announces, currentPage, pageLimit);
    }, [announces, currentPage, pageLimit]);

    const match = useRouteMatch();

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            
            {(authUser && authUser.roles['admin']) &&
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
            
            <Filter  
                isFilter={isFiltered} 
                handleFilterClick={toggleFilter} 
                handleFilterReset={resetFilter}/>
            
            <FilterDialog  
                filterOpen={filterOpen}
                filterOption={filterOption}
                filterConjunction={filterConjunction}
                error={error}
                handleSearchQuery={setFilterCategory}
                handleSearchText={setFilterText}
                handleSearchClick={toggleSearch}
                onClose={toggleFilter}/>

            <Sort 
                selectedAnchor={selectedAnchor}
                handleSortClick={toggleSort}/>

            <SortPopover
                anchorEl={anchorOpen} 
                open={Boolean(anchorOpen)} 
                onClose={setSort}/>

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
                        const redirectPath = { 
                            pathname: `${match.path}/announcement/${announce.id}`, 
                            state: { title: 'Service Centre', tab: 0 } 
                        }
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
                                <TableCell align='center'>{format([announce.createdAt, announce.updatedAt].sort(compareAsc).pop(), 'P')}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination 
                count={announces.length}
                currentPage={currentPage} 
                resourcesPerPage={pageLimit}
                handlePageChange={setCurrentPage}/>
        </Container>
    )
}