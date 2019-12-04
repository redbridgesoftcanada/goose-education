import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';

const styles = theme => ({
    filterButton: {
        float: 'left',
        color: theme.palette.primary.light,
        border: `2px solid ${theme.palette.primary.light}`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
});

function Filter(props) {
    const { classes, handleFilterClick } = props;

    return (
        <>
            <Button 
                className={classes.filterButton} 
                onClick={handleFilterClick}
                startIcon={<SearchOutlined/>}
            >
                Filter
            </Button>
        </>
    )
}

export default withStyles(styles)(Filter);