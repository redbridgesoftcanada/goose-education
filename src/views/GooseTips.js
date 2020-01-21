import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';

import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import SearchBar from '../components/SearchBar';
import ArticleDialog from '../components/ArticleDialog';
import Pagination from '../components/Pagination';

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    image: {
        display: 'block',
        border: 0,
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0 auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3, 5),
        textAlign: 'left',
        "&:hover": {
            cursor: 'pointer',
        },
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1, 0),
    },
    articleTitle: {
        fontWeight: 700,
    },
    articleDescription: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '23em',
    },
    search: {
        float: 'right',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: 5,
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
        backgroundColor: 'rgb(240, 150, 20)',
        color: theme.palette.common.white,
        padding: 3,
        width: '4em',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

const INITIAL_STATE = {
    composeOpen: false,
    filterOpen: false,
    anchorOpen: null,
    tipOpen: false,
    selectedTip: null
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
        
        case 'OPEN_TIP':
            let selectedTip = payload.database.find(tip => tip.id.toString() === payload.selected.id);
        return { 
            ...state, 
            selectedTip,
            tipOpen: true, 
        }
        
        case 'CLOSE_TIP':
            return { ...state, tipOpen: false, selectedTip: null }
    }
}

function GooseTips(props) {
    const { classes, tipsDB } = props;
    
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
    const { filterOpen, anchorOpen, tipOpen, selectedTip } = state;
    // let match = useRouteMatch();

    return (
        <section className={classes.root}>
            <Container>
                <Typography variant="h3" marked="center" className={classes.title}>
                    Goose Tips
                </Typography>
                <Filter handleFilterClick={() => dispatch({ type: 'OPEN_FILTER' })}/>
                <Sort handleSortClick={event => dispatch({ type: 'OPEN_SORT', payload: event.currentTarget })}/>
                <SearchBar />

                <FilterDialog filterOpen={filterOpen} onClose={() => dispatch({ type: 'CLOSE_FILTER' })} />
                <SortPopover anchorEl={anchorOpen} open={Boolean(anchorOpen)} onClose={() => dispatch({ type: 'CLOSE_SORT'})}/>
                <Grid container>
                    {tipsDB.map(tip => {
                        return (
                            <Grid item xs={12} md={4} key={tip.id} className={classes.background}>
                                <div id={tip.id} onClick={event => dispatch({ type: 'OPEN_TIP', payload: { selected: event.currentTarget, database: tipsDB } })} className={classes.item}>
                                    <img
                                        className={classes.image}
                                        src={require(`../assets/img/${tip.image}`)}
                                        alt="tip-thumbnail"
                                    />
                                    <div className={classes.body}>
                                        {(tip.views > 100) ? <Typography className={classes.badge}>Hot</Typography> : ''}
                                        <Typography variant="body1" className={classes.articleTitle}>
                                            {tip.title}
                                        </Typography>
                                        <Typography noWrap variant="body2" className={classes.articleDescription}>
                                            {tip.description}
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
                <ArticleDialog articleOpen={tipOpen} onClose={() => dispatch({ type: 'CLOSE_TIP' })} article={selectedTip}/>
                <Pagination />
            </Container>
        </section>
    );
}

GooseTips.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GooseTips);