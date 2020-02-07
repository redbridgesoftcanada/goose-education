import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { HighlightOffOutlined, SearchOutlined } from '@material-ui/icons';

const styles = theme => ({
    filterButton: {
        float: 'left',
        border: `2px solid ${theme.palette.primary.light}`,
        marginRight: theme.spacing(1),
        
        "&:hover": {
            backgroundColor: theme.palette.primary.light
        }
    },
});

function Filter(props) {
    const { classes, isFilter, handleFilterClick, handleFilterReset } = props;

    return (
        <Button
            color='inherit'
            variant='contained'
            size='medium' 
            className={classes.filterButton} 
            {...(isFilter) ? {onClick: handleFilterReset, startIcon:<HighlightOffOutlined/>} : {onClick: handleFilterClick, startIcon:<SearchOutlined/>}}
        >
            {(isFilter) ? 'Clear' : 'Filter' }
        </Button>
    )
}

export default withStyles(styles)(Filter);