import React, { useReducer } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format } from 'date-fns';

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

const INITIAL_STATE = {
    composeOpen: false,
    filterOpen: false,
    anchorOpen: null
}

function toggleReducer(state, action) {
    let { type, payload } = action;
  
    switch(type) {
        case 'OPEN_COMPOSE':
            return { ...state, composeOpen: true }

        case 'CLOSE_COMPOSE':
            return { ...state, composeOpen: false }

        case 'OPEN_FILTER':
            return { ...state, filterOpen: true }
        
        case 'CLOSE_FILTER':
            return { ...state, filterOpen: false }
        
        case 'OPEN_SORT':
            return { ...state, anchorOpen: payload }
        
        case 'CLOSE_SORT':
            return { ...state, anchorOpen: null }
    }
}

function AnnouncementBoard(props) {
    const { announcementsDB, handleClick, classes } = props;
    
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { filterOpen, anchorOpen } = state;
    let match = useRouteMatch();

    return (
        <Container>
            <SocialMediaButtons title={title} description={description}/>
            <div className={classes.wrapper}>
                <Filter handleFilterClick={() => dispatch({ type: 'OPEN_FILTER' })}/>
                <Sort handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
            </div>
            <FilterDialog filterOpen={filterOpen} onClose={() => dispatch({ type: 'CLOSE_FILTER' })} />
            <SortPopover anchorEl={anchorOpen} open={Boolean(anchorOpen)} onClose={() => dispatch({ type: 'CLOSE_SORT'})}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {announcementsDB.map(announcement => {
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
            <Pagination />
        </Container>
    )
}

export default withStyles(styles)(AnnouncementBoard);