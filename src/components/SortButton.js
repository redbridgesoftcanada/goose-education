import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { UnfoldMoreOutlined } from '@material-ui/icons';

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

function Sort(props) {
    const { classes, handleSortClick } = props;

    return (
        <>
            <Button 
                className={classes.filterButton} 
                onClick={handleSortClick}
                startIcon={<UnfoldMoreOutlined/>}
            >
                Sort
            </Button>
        </>
    )
}

export default withStyles(styles)(Sort);