import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, withStyles } from '@material-ui/core';

import Typography from '../components/onePirate/Typography';

import FilterSortSearch from '../components/FilterSortSearch';
import FilterDialog from '../components/FilterDialog';
import SortPopover from '../components/SortPopover';
import Pagination from '../components/Pagination';

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3, 5),
        textAlign: 'left'
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1, 0),
    },
    articleTitle: {
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
});

function GooseTips(props) {
    const { classes } = props;

    // COMPONENTS > Filter Dialog Modal 
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // COMPONENTS > Sort Popover
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    return (
        <section className={classes.root}>
            <Container>
                <Typography variant="h3" marked="center" className={classes.title}>
                    Goose Tips
                </Typography>
                <FilterSortSearch handleClick={handleClick} handleClickOpen={handleClickOpen} />
                <FilterDialog open={open} onClose={handleClose} />
                <SortPopover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handlePopoverClose}/>
                <Grid container>
                    <Grid item xs={12} md={4} className={classes.background}>
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/6_copy_14_2_copy_6_1_copy_2_2948936627_zlcboNC3_e1e0cdafaaf268f678768639069a77d6921aba1e.jpg")}
                                alt="article-thumbnail"
                            />
                            <div className={classes.description}>
                                <Typography variant="body1" className={classes.articleTitle}>
                                    [Goose Tips] Post Title
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4} className={classes.background}>
                    <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/6_copy_14_2_copy_6_1_copy_2_2948936627_zlcboNC3_e1e0cdafaaf268f678768639069a77d6921aba1e.jpg")}
                                alt="article-thumbnail"
                            />
                            <div className={classes.description}>
                                <Typography variant="body1" className={classes.articleTitle}>
                                    [Goose Tips] Post Title
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4} className={classes.background}>
                    <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/6_copy_14_2_copy_6_1_copy_2_2948936627_zlcboNC3_e1e0cdafaaf268f678768639069a77d6921aba1e.jpg")}
                                alt="article-thumbnail"
                            />
                            <div className={classes.description}>
                                <Typography variant="body1" className={classes.articleTitle}>
                                    [Goose Tips] Post Title
                                </Typography>
                                <Typography variant="body2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Pagination />
            </Container>
        </section>
    );
}

GooseTips.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GooseTips);