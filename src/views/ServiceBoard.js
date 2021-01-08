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

export default function ServiceBoard({ active, filterReset }) {
  const authUser = useContext(AuthUserContext);
  const { dispatch } = useContext(DispatchContext);
  const stateContext = useContext(StateContext);

  const serviceType = (active === 0) ? 'announces' : 'messages';

  const serviceContent = stateContext[serviceType];   // listOfAnnouncements: 'announces', listOfMessages: 'messages';
  const { 
    currentPage, 
    pageLimit,
    composeOpen, 
    anchorOpen, 
    anchorSelect, 
    isFiltered,
    filterOpen,
    filterOption, 
    filterConjunction, 
    filterQuery 
  } = stateContext;

  const [ filterError, setFilterError ] = useState(null); 

  const paginateRef = useRef(null);
  paginateRef.current = createPagination(serviceContent, currentPage, pageLimit);

  const setCurrentPage = (ev, newValue) => dispatch({ type: 'setCurrentPage', payload: newValue });

  const setSelected = ev => {
    const selectedData = serviceContent.find(ref => ref.id.toString() === ev.currentTarget.id);
    const dispatchType = (serviceType === 'announces') ? 'setAnnounce' : 'setMessage';
    dispatch({ type: dispatchType, payload: selectedData });
  }

  const toggleComposeDialog = () => dispatch({ type: 'composeToggle' });

  const toggleSort = ev => dispatch({ type: 'sortToggle', payload: ev.currentTarget });

  const setSort = ev => {
    const category = ev.currentTarget.id;
    const sortedResources = sortQuery(serviceType, serviceContent, category);
    dispatch({ type: 'setSort', payload: { category, serviceType, sortedResources } });
  }

  const toggleFilter = () => {
    (!filterOpen === false ) && setFilterError(null);
    dispatch({ type: 'filterToggle' });
  }

  const setFilterCategory = ev => {
    const category = ev.target.name;
    const input = ev.target.value;
    dispatch({ type:'filterCategory', payload: { category, input } });
  }

  const inputDebounce = useCallback(debounce(value => 
    dispatch({ type: 'filterText', payload: value }), 500));

  const setFilterText = ev => inputDebounce(ev.target.value);
  
  const toggleSearch = () => {
    let filteredContent = [];
    if (filterQuery.split(/[ ,]+/).filter(Boolean).length > 1) {
      filteredContent = multipleFilterQuery(serviceContent, filterOption, filterConjunction, filterQuery);

    } else if (Boolean(filterQuery)) {
      filteredContent = singleFilterQuery(serviceContent, filterOption, filterQuery);

    } else {
      setFilterError('Please enter one or more filter terms');
    }

    if (!filteredContent.length) {
      setFilterError('Sorry, no matches found!');
    } else {
      const dispatchType = (serviceType === 'announces') ? 'setFilteredAnnounces' : 'setFilteredMessages';
      dispatch({ type: dispatchType, payload: filteredContent });
    }
  } 

  const resetFilter = () => {
    setFilterError(null);
    filterReset();
  }

  // [Filter/Sort] organize and load content into paginated groups; 
  useEffect(() => {
    paginateRef.current = createPagination(serviceContent, currentPage, pageLimit);
  }, [serviceContent, currentPage, pageLimit]);

  // [Filter/Sort] reset values/results if valid when changing tabs;
  useEffect(() => {
    if (isFiltered) resetFilter();
    if (anchorSelect) {
      const sortedResources = sortQuery(serviceType, serviceContent, "reset");
      dispatch({ type: 'setSort', payload: { category: "reset", serviceType, sortedResources } });
    }
  }, [active])

  const match = useRouteMatch();
  const pageHeader = configurePageHeader(serviceType);

    return (
      <Container>
        <SocialMediaButtons title={pageHeader.title} description={pageHeader.description}/>
          
        {(authUser && authUser.roles['admin']) &&
          <>
            <Compose handleComposeClick={toggleComposeDialog}/> 
            <ComposeDialog
              isEdit={false}
              composeType={serviceType}
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
          error={filterError}
          handleSearchQuery={setFilterCategory}
          handleSearchText={setFilterText}
          handleSearchClick={toggleSearch}
          onClose={toggleFilter}/>

        <Sort 
          selectedAnchor={anchorSelect}
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
            {paginateRef.current.map(sResource => {
              const redirectPath = configureRedirects(serviceType, match, sResource);
                return (
                  <TableRow hover key={sResource.id} id={sResource.id} onClick={setSelected}>
                    <TableCell align='center'>
                      <Link
                        color="inherit"
                        underline="none"
                        component={RouterLink} 
                        to={redirectPath}>
                          {sResource.title}
                      </Link>
                    </TableCell>
                    <TableCell align='center'>{sResource.authorDisplayName}</TableCell>
                    <TableCell align='center'>{format([sResource.createdAt, sResource.updatedAt].sort(compareAsc).pop(), 'P')}</TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
        <Pagination 
          count={serviceContent.length}
          currentPage={currentPage} 
          resourcesPerPage={pageLimit}
          handlePageChange={setCurrentPage}/>
      </Container>
    )
}

function configurePageHeader(serviceType) {
  const pageHeader = {};
  
  if (serviceType === 'announces') {
    pageHeader.title = 'Announcement Board';
    pageHeader.description = 'Check out the latest news from Goose!';
  
  } else if (serviceType === 'messages') {
    pageHeader.title = 'Study Abroad Counselling';
    pageHeader.description = 'We will respond to your inquiry within 24 hours.';
  
  } else {
    console.log(`Missing serviceType value (logged: ${serviceType}) to generate title/description for ServiceBoard page header.`);
  }
  
  return pageHeader;
}

function configureRedirects(serviceType, match, sResource) {
  const redirectPath = {};

  if (serviceType === 'announces') {
    redirectPath.pathname = `${match.path}/announcement/${sResource.id}`; 
    redirectPath.state = { title: 'Service Centre', tab: 0 };

  } else if (serviceType === 'messages') {
    redirectPath.pathname = `${match.path}/message/${sResource.id}`; 
    redirectPath.state = { title: 'Service Centre', tab: 1 };
  
  } else {
    console.log(`Missing serviceType value (logged: ${serviceType}) to generate redirect path for selected resource.`);
  } 

  return redirectPath;
}