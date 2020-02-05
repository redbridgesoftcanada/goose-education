import React, { useReducer } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { format } from 'date-fns';

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
            const selectedSort = payload.id;
            let sortedMessages;
            if (selectedSort === 'date') {
                sortedMessages = state.messages.sort((a,b) => (a.updatedAt > b.updatedAt) ? -1 : ((b.updatedAt > a.updatedAt) ? 1 : 0))
            } else if (selectedSort === 'views') {
                sortedMessages = state.messages.sort((a,b) => (a.views > b.views) ? -1 : ((b.views > a.views) ? 1 : 0))
            } else {
                sortedMessages = state.messages.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
            }

            return { 
                ...state, 
                anchorOpen: null,
                selectedAnchor: (selectedSort !== 'reset' || selectedSort !== '') ? selectedSort : null,
                messages: sortedMessages
            }
    }
}

function MessageBoard({classes, handleClick, messagesDB}) {
    const INITIAL_STATE = {
        messages: messagesDB,
        composeOpen: false,
        filterOpen: false,
        anchorOpen: null
    }
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { composeOpen, filterOpen, anchorOpen } = state;
    let match = useRouteMatch();

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
                <Filter handleFilterClick={() => dispatch({ type: 'OPEN_FILTER' })}/>
                <Sort handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
            </div>
            <FilterDialog filterOpen={filterOpen} onClose={() => dispatch({ type: 'CLOSE_FILTER' })} />
            <SortPopover anchorEl={anchorOpen} open={Boolean(anchorOpen)} onClose={event => dispatch({ type: 'CLOSE_SORT', payload: event.currentTarget})}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Author</TableCell>
                        <TableCell align='center'>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messagesDB.map(message => {
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