import React from 'react';
import { Button, withStyles, Typography } from '@material-ui/core';
import { HighlightOffOutlined, SearchOutlined } from '@material-ui/icons';

const styles = theme => ({
    filterButton: {
        float: 'left',
        border: `2px solid ${theme.palette.primary.light}`,
        marginRight: theme.spacing(1),
        
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: '#FFF'
        }
    },
});

function Filter(props) {
    const { classes, isFilter, handleFilterClick, handleFilterReset } = props;

    const notFiltered = {
        onClick: handleFilterClick, 
        startIcon: <SearchOutlined/>,
        children: 'Filter'
    };
    
    const isFiltered = {
        onClick: handleFilterReset, 
        startIcon: <HighlightOffOutlined/>,
        children: 'Clear'
    };

    return (
        <Button
            variant='outlined'
            size='medium' 
            className={classes.filterButton} 
            {...(isFilter) ? isFiltered : notFiltered}
        >
        </Button>
    )
}

export default withStyles(styles)(Filter);