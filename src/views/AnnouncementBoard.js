import React, { useState } from 'react';
import { Container, Grid, IconButton, Link, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, withStyles } from '@material-ui/core';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import { Link as RouterLink, useRouteMatch } from "react-router-dom";

import Filter from '../components/FilterButton';
import FilterDialog from '../components/FilterDialog';
import Sort from '../components/SortButton';
import SortPopover from '../components/SortPopover';
import Pagination from '../components/Pagination';

const styles = theme => ({
    title: {
        marginTop: theme.spacing(5),
    },
    button: {
        "&:hover": {
          backgroundColor: "transparent"
        }
    },
    email: {
        fontSize: '35px',
    },
    image: {
        width: '2rem',
    },
    wrapper: {
        marginTop: theme.spacing(3),
    },
});

function AnnoucementBoard(props) {
    const { announcementsDB, handleClick, classes } = props;
    let match = useRouteMatch();

    const [state, setState] = useState({
        filterOpen: false,
        anchorEl: null,
    });

    const { filterOpen, anchorEl } = state;

    // COMPONENTS > Filter Dialog Modal 
    const handleFilterClick = () => setState({...state, filterOpen: true});
    const handleFilterClose = () => setState({...state, filterOpen: false});
    
    // // COMPONENTS > Sort Popover
    const handleSortClick = event => setState({...state, anchorEl: event.currentTarget});
    const handleSortClose = () => setState({...state, anchorEl: null});

    return (
        <Container>
            <Typography variant='h4' className={classes.title}>
                Announcement Board
            </Typography>
            <Typography variant='subtitle2'>
                Check out the latest news from Goose!
            </Typography>
            <Grid container className={classes.title}>
                <Grid item xs={3} md={3}>
                    <Tooltip title='goose.education@gmail.com' placement='top'>
                        <IconButton className={classes.button}>
                            <EmailOutlinedIcon className={classes.email}/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Tooltip title='Kakao' placement='top'>
                        <IconButton 
                            className={classes.button}
                            component={Link}
                            href='https://pf.kakao.com/_hNspC'
                            target='_blank'>
                            <img src={require('../assets/img/kakaolink_btn_small.png')} alt='Kakao Talk'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Tooltip title='Instagram' placement='top'>
                        <IconButton 
                        className={classes.button}
                        component={Link}
                        href='https://www.instagram.com/gooseedu/'
                        target='_blank'>
                            <img className={classes.image} src={require('../assets/img/glyph-logo_May2016.png')} alt='Instagram'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Tooltip title='Facebook' placement='top'>
                        <IconButton 
                        className={classes.button}
                        component={Link}
                        href='https://www.facebook.com/gooseedu'
                        target='_blank'>
                            <img className={classes.image} src={require('../assets/img/f_logo_RGB-Blue_250.png')} alt='Facebook'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <div className={classes.wrapper}>
                <Filter handleFilterClick={handleFilterClick}/>
                <Sort handleSortClick={handleSortClick}/>
            </div>
            <FilterDialog filterOpen={filterOpen} onClose={handleFilterClose} />
            <SortPopover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}/>
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
                                            pathname: `${match.path}/${announcement.id}`, 
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
                                <TableCell align='center'>{announcement.date}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination />
        </Container>
    )
}

export default withStyles(styles)(AnnoucementBoard);