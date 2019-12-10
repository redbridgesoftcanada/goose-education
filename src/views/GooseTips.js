import React, { useState } from 'react';
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

function GooseTips(props) {
    const { classes, tipsDB } = props;

    const [state, setState] = useState({
        filterOpen: false,
        anchorEl: null,
        tipsOpen: false,
        tip: null,
    });

    const { filterOpen, anchorEl, tipsOpen, tip } = state;

    // COMPONENTS > Filter Dialog Modal 
    const handleFilterClick = () => setState({...state, filterOpen: true});
    const handleFilterClose = () => setState({...state, filterOpen: false});
    
    // // COMPONENTS > Sort Popover
    const handleSortClick = event => setState({...state, anchorEl: event.currentTarget});
    const handleSortClose = () => setState({...state, anchorEl: null});

    // // COMPONENTS > Article Dialog Modal 
    const handleTipClick = event => setState({...state, tipsOpen: true, tip: tipsDB.find(tip => tip.id.toString() === event.currentTarget.id)});
    const handleTipClose = () => setState({...state, tipsOpen: false, tip: null});

    return (
        <section className={classes.root}>
            <Container>
                <Typography variant="h3" marked="center" className={classes.title}>
                    Goose Tips
                </Typography>
                <Filter handleFilterClick={handleFilterClick}/>
                <Sort handleSortClick={handleSortClick}/>
                <SearchBar />
                <FilterDialog filterOpen={filterOpen} onClose={handleFilterClose} />
                <SortPopover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}/>
                <Grid container>
                    {tipsDB.map(tip => {
                        return (
                            <Grid item xs={12} md={4} key={tip.id} className={classes.background}>
                                <div id={tip.id} onClick={handleTipClick} className={classes.item}>
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
                <ArticleDialog articleOpen={tipsOpen} onClose={handleTipClose} article={tip}/>
                <Pagination />
            </Container>
        </section>
    );
}

GooseTips.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GooseTips);