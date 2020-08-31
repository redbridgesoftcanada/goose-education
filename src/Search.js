import React, { Fragment, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { AccountCircleOutlined, LocalOfferOutlined, ScheduleOutlined } from '@material-ui/icons';
import withRoot from './withRoot';
import { createPagination, singleFilterQuery, multipleFilterQuery } from './constants/helpers/_features';
import { AuthUserContext } from './components/session';
import ArticleDialog from './components/ArticleDialog';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  menu: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  image: {
    display: 'block',
    border: '0',
    borderRadius: '50%',
    width: 'auto',
    maxWidth: '25%',
    height: 'auto',
    margin: '0px auto',
  },
  item: {
    padding: theme.spacing(1, 1),
    textAlign: 'left',
    cursor: 'pointer',
  },
  body: {
    flexDirection: 'column',
    '&:hover': {
        color: theme.palette.secondary.main,
    },
  },
}));

function Search(props) {
  const INITIAL_STATE = {
    searchedResources: [],
    searchCategory: 'All',
    searchOption: 'Title + Contents',
    searchConjunction: 'Or',
    searchQuery: '',
    dialogOpen: false,
    selectedResource: null,
    currentPage: 0,
    resourcesPerPage: 10
  }
  const classes = useStyles();
  const [ state, setState ] = useState(INITIAL_STATE);
  const { searchedResources, searchCategory, searchOption, searchConjunction, dialogOpen, selectedResource, currentPage, resourcesPerPage } = state;

  // E V E N T  L I S T E N E R S
  const handleDialogClose = () => setState({...state, dialogOpen: false, selectedResource: null});
  const handleSearchQuery = event => setState({...state, [event.target.name]: event.target.value});
  const handlePageChange = (event, newPage) => setState({...state, currentPage: newPage});
  const handleResourceClick = selectedResource => {
    if (Object.keys(selectedResource).includes('author')) {
      setState({...state, dialogOpen: true, selectedResource });
    } else {
      props.history.push({
        pathname: `/schools/${selectedResource.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`,
        state: {
          title: 'School Information',
          selected: 0,
          selectedSchool: selectedResource
        }
    })}
  }

  const totalPages = Math.ceil(searchedResources.length/resourcesPerPage);
  const paginatedResources = createPagination(searchedResources, currentPage, resourcesPerPage, totalPages);
  
  useEffect(() => {
    const resourcesDB = props.location.state.resources;
    const searchWords = props.location.search.toLowerCase().split('=')[1];
    const formattedSearchWords = searchWords.replace(/[^a-zA-Z ]/g, ",").split(/[ ,]+/).filter(Boolean);
    
    let searchedResources = [];
    if (formattedSearchWords.length > 1) {
      searchedResources = multipleFilterQuery(resourcesDB, searchOption, searchConjunction, searchWords);
    } else if (Boolean(formattedSearchWords)) {
      searchedResources = singleFilterQuery(resourcesDB, searchOption, searchWords);
    }

    setState({ ...state, searchedResources, searchQuery: formattedSearchWords})
  }, [props.location]);

  return (
    <>
      <ResponsiveNavBars/>
      <SearchBar classes={classes} searchProps={{...state}} handleSearchQuery={handleSearchQuery} />
      <Container>
        <Typography align="left" variant="h6">My Search Results</Typography>
        {paginatedResources.map((resource, i) => {
          return (
            <Fragment key={i}>
              <Grid container alignItems="center" className={classes.item}>
                <Grid item xs={3} md={3}>
                  <img
                    className={classes.image}
                    src={(resource.image.includes('firebase')) ? resource.image : require(`./assets/img/${resource.image}`)}
                    // alt=''
                  />
                </Grid>
                <Grid item xs={9} md={9} className={classes.body} onClick={() => handleResourceClick(resource)}>
                  <div>{resource.title}</div>
                  <Grid container spacing={2} >
                    {resource.authorDisplayName && 
                      <Grid item>
                        <AccountCircleOutlined fontSize="small"/> 
                        {resource.authorDisplayName}
                      </Grid>
                    }

                    {resource.tag && 
                      <Grid item>
                        <LocalOfferOutlined fontSize="small"/> 
                        {resource.tag}
                      </Grid>
                    }

                    {(resource.updatedAt || resource.createdAt) && 
                      <Grid item>
                        <ScheduleOutlined fontSize="small"/> 
                        {(resource && resource.updatedAt > resource.createdAt) ? format(resource.updatedAt, 'Pp') : format(resource.createdAt, 'Pp')}
                      </Grid>
                    }
                  </Grid>
                  <div>{resource.description}</div>
                </Grid>
              </Grid>
            </Fragment>
          )
        })}
      {/* <Typography variant="caption">{(searchCategory !== "All") && `More ${searchCategory.toUpperCase()}`}</Typography> */}
      <AuthUserContext.Consumer>
        { authUser => authUser &&
          <ArticleDialog 
          authUser={authUser} 
          history={props.history}
          articleOpen={dialogOpen} 
          onClose={handleDialogClose} 
          article={selectedResource}/>
        }
      </AuthUserContext.Consumer>
      <Pagination totalPages={totalPages} currentPage={currentPage} resourcesPerPage={resourcesPerPage} handlePageChange={handlePageChange}/>
      </Container>
      <ResponsiveFooters/>
    </>
  );
}

export default withRoot(Search);