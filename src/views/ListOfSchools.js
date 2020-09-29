import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link as RouterLink, useHistory, useRouteMatch } from "react-router-dom";
import { CardMedia, Container, Grid, Link, Typography } from '@material-ui/core';
import { createPagination } from '../constants/helpers/_features';
import SearchField from '../components/SearchField';
import Pagination from '../components/Pagination';
import { useStyles } from '../styles/schools';

export default function ListOfSchools(props) {
    const { handleSelectedSchool, listOfSchools } = props;
    const classes = useStyles(props, 'schoolInformation');
    const history = useHistory();
    const match = useRouteMatch();
    
    const [ query, setQuery ] = useState('');
    
    const paginateRef = useRef(null);
    const [ paginate, setPaginate ] = useState({ currentPage: 0, pageLimit: 5 });
    paginateRef.current = createPagination(listOfSchools, paginate.currentPage, paginate.pageLimit);

    useEffect(() => {
        paginateRef.current = createPagination(props.listOfSchools, paginate.currentPage, paginate.pageLimit);
    }, [props.listOfSchools])

    return (
        <section className={classes.sectionRoot}>
            <Container>
                <Typography className={classes.counter}>There are a total of <b>{listOfSchools.length}</b> schools.</Typography>
                <SearchField 
                    handleSearch={event => setQuery(event.target.value)}
                    handleSearchClick={() => 
                        history.push({
                            pathname:'/search', 
                            search:`?query=${query}`, 
                            state: { resources: listOfSchools, category: 'Schools' } })}/>
                <Grid container spacing={2} className={classes.grid}>
                    {paginateRef.current.map(school => {
                        const redirectPath = {
                            pathname: `${match.path}/${school.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                            state: {
                                title: 'School Information',
                                selected: 0,
                            }
                        }
                        return (
                            <Fragment key={school.id}>
                                <Grid item xs={4} md={3}>
                                    <CardMedia
                                        component='img'
                                        className={classes.image}
                                        image={(school.image.includes('firebase')) ? school.image : require(`../assets/img/${school.image}`)}/>
                                </Grid>
                                <Grid item xs={8} md={9} className={classes.school}>
                                    <Link className={classes.schoolTitle} 
                                        id={school.id} 
                                        component={RouterLink} 
                                        onClick={handleSelectedSchool}
                                        to={redirectPath}
                                    >
                                        {school.title}
                                    </Link>

                                    {(school.recommendation) ? <Typography className={classes.badge}>Recommend</Typography> : ''}

                                    <Link className={classes.schoolDescription}
                                        id={school.id} 
                                        component={RouterLink} 
                                        onClick={handleSelectedSchool}
                                        to={redirectPath}
                                    >
                                        {school.description}
                                    </Link>
                                </Grid>
                            </Fragment>
                        );
                    })}
                </Grid>
                <Pagination 
                    count={listOfSchools.length}
                    currentPage={paginate.currentPage} 
                    resourcesPerPage={paginate.pageLimit}
                    handlePageChange={(event, newPage) => setPaginate(prevState => ({...prevState, currentPage: newPage}))}/>
            </Container>
        </section>
    );
}