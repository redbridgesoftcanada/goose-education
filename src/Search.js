import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, CardMedia, Container, Grid, Typography } from '@material-ui/core';
import { AccountCircleOutlined, LocalOfferOutlined, ScheduleOutlined } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import parse from 'html-react-parser';
import { format, compareDesc } from 'date-fns';
import withRoot from './withRoot';
import { createPagination, singleFilterQuery, multipleFilterQuery } from './constants/helpers/_features';
import { AuthUserContext } from './components/session';
import ArticleDialog from './components/ArticleDialog';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import useStyles from './styles/search';

const INITIAL_STATE = {
  searchedResources: [],
  searchCategory: 'All',
  searchOption: 'Title + Contents',
  searchConjunction: 'Or',
  searchQuery: '',
  dialogOpen: false,
  selectedResource: null,
}

function Search(props) {
  const classes = useStyles();
  const history = useHistory();

  const [ state, setState ] = useState(INITIAL_STATE);
  const { searchedResources, searchCategory, searchOption, searchConjunction, dialogOpen, selectedResource } = state;

  // Pagination
  const paginateRef = useRef(null);
  const [ paginate, setPaginate ] = useState({ currentPage: 0, pageLimit: 5 });
  paginateRef.current = createPagination(searchedResources, paginate.currentPage, paginate.pageLimit);

  // const handleSearchQuery = event => setState({...state, [event.target.name]: event.target.value});
  const handleDialogClose = () => setState({...state, dialogOpen: false, selectedResource: null});
  const handleResourceClick = selectedResource => {
    switch(searchCategory) {
      case 'Tips':
        history.push({
          pathname: '/goose', 
          state: { title: 'Goose Tips', selected: 1, selectedTip: selectedResource } 
        });
        break;

      case 'Networking':
        history.push({
          pathname: '/networking', 
          state: { title: 'Networking', selected: 0, article: selectedResource } 
        });
        break;

      case 'Schools':
        history.push({
          pathname: '/schools', 
          state: { title: 'School Information', selected: 0, selectedSchool: selectedResource } 
        });
        break;
    }
  }
  
  useEffect(() => {
    const { resources, category } = props.location.state;
    const searchWords = props.location.search.toLowerCase().split('=')[1];
    const formattedSearchWords = searchWords.replace(/[^a-zA-Z ]/g, ",").split(/[ ,]+/).filter(Boolean);
    
    let searchedResources = [];
    if (formattedSearchWords.length > 1) {
      searchedResources = multipleFilterQuery(resources, searchOption, searchConjunction, searchWords);
    } else if (Boolean(formattedSearchWords)) {
      searchedResources = singleFilterQuery(resources, searchOption, searchWords);
    }

    setState({ ...state, searchedResources, searchCategory: category, searchQuery: formattedSearchWords});

  }, [props.location]);

  return (
    <>
      <ResponsiveNavBars/>
      {/* <SearchBar classes={classes} searchProps={{...state}} handleSearchQuery={handleSearchQuery} /> */}
      <Container>
        {!paginateRef.current.length ? 
        <Typography className={classes.noMatchError}>No matches found.</Typography>
        :
        paginateRef.current.map((resource, i) => {
          return (
            <Fragment key={i}>
              <Card variant='outlined' className={classes.card}>
                <Grid container alignItems='center'>

                  <Grid item xs={3} md={3}>
                    <CardMedia 
                      className={classes.image}
                      image={(resource.image.includes('firebase')) ? resource.image : require(`./assets/img/${resource.image}`)}
                    />
                  </Grid>

                  <Grid container item xs={9} md={9} onClick={() => handleResourceClick(resource)} className={classes.summary}>
                  
                    <Grid item>
                      <Typography variant='h6' className={classes.title}>{resource.title}</Typography>
                    </Grid>

                  {searchCategory !== 'Schools' &&
                    <Grid container item spacing={1} className={classes.meta}>
                      <Grid item>
                        <AccountCircleOutlined fontSize="small" className={classes.icon}/> 
                        {resource.authorDisplayName}
                      </Grid>

                      {resource.tag && 
                        <Grid item>
                          <LocalOfferOutlined fontSize="small" className={classes.icon}/> 
                          {resource.tag}
                        </Grid>
                      }

                      <Grid item>
                        <ScheduleOutlined fontSize="small" className={classes.icon}/> 
                        {format([resource.createdAt, resource.updatedAt].sort(compareDesc).pop(), 'P')}
                      </Grid>
                    </Grid>
                  }
                    <Grid item className={classes.description}>
                      {parse(resource.description)}
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Fragment>
          )
        })}
        <Pagination 
          count={state.searchedResources.length}
          currentPage={paginate.currentPage} 
          resourcesPerPage={paginate.pageLimit}
          handlePageChange={(event, newPage) => setPaginate(prevState => ({...prevState, currentPage: newPage}))}/>
      </Container>
      <ResponsiveFooters/>
    </>
  );
}

export default withRoot(Search);