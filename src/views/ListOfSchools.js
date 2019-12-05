import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Link, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import Typography from '../components/onePirate/Typography';

import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const styles = theme => ({
    root: {
        overflow: 'hidden',
        marginTop: '25px',
    },
    counter: {
        float: 'left',
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '65%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3, 1),
        textAlign: 'left',
        cursor: 'pointer',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1, 0),
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    },
    schoolTitle: {
        fontWeight: 700,
    },
    search: {
        float: 'right',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: '5px',
        paddingLeft: theme.spacing(1),
    },
    searchButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    filterButton: {
        float: 'left',
        color: theme.palette.primary.light,
        border: `2px solid ${theme.palette.primary.light}`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    badge: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        padding: '3px',
        width: '8em',
        fontSize: '12px',
        fontWeight: 600,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
});

function ListOfSchools(props) {
    const { classes, handleSchoolClick, schoolsDB } = props;

    let match = useRouteMatch();

    return (
        <section className={classes.root}>
            <Container>
                <Typography variant="body2" className={classes.counter}>There are a total of <b>{schoolsDB.length}</b> schools.</Typography>
                <SearchBar />
                <Grid container>
                    {schoolsDB.map(school => {
                        return (
                            <Grid item xs={12} md={12} key={school.id}>
                                <div className={classes.item}>
                                    <Grid item xs={3} md={3}>
                                    <img
                                        className={classes.image}
                                        src={require(`../assets/img/${school.image}`)}
                                        alt='school-logo'
                                    />
                                    </Grid>
                                    <Grid item xs={9} md={9} className={classes.body}>
                                    <Link
                                        id={school.id} 
                                        color="inherit"
                                        variant="h6"
                                        underline="none"
                                        className={classes.schoolTitle}
                                        component={RouterLink} 
                                        onClick={handleSchoolClick}
                                        to=
                                        {{
                                            pathname: `${match.path}/${school.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                                            state: {
                                                title: 'School Information',
                                                selected: 0,
                                            }
                                        }}
                                        >
                                            {school.name}
                                        </Link>

                                        {(school.recommendation) ? <Typography className={classes.badge}>Recommend</Typography> : ''}

                                        <Link
                                            id={school.id} 
                                            color="inherit"
                                            variant="body2"
                                            underline="none"
                                            component={RouterLink} 
                                            onClick={handleSchoolClick}
                                            to=
                                            {{
                                                pathname: `${match.path}/${school.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                                                state: {
                                                    title: 'School Information',
                                                    selected: 0,
                                                }
                                            }}
                                        >
                                            {school.introduction}
                                        </Link>
                                    </Grid>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
                <Pagination />
            </Container>
        </section>
    );
}

ListOfSchools.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfSchools);