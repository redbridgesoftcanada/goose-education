import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { ScheduleOutlined, VisibilityOutlined, UnfoldMoreOutlined } from '@material-ui/icons';

const styles = theme => ({
    sortButton: {
        float: 'left',
        border: `2px solid ${theme.palette.primary.light}`,
        marginRight: theme.spacing(1),

        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: '#FFF'
        }
    },
});

function Sort(props) {
    const { classes, selectedAnchor, handleSortClick} = props;

    const setStartIcon = () => {
        switch(selectedAnchor) {
            case 'date':
                return <ScheduleOutlined/>;
            case 'views':
                return <VisibilityOutlined/>;
            default:
                return <UnfoldMoreOutlined/>;
        }
    }

    return (
        <Button
            variant='outlined'
            size='medium'
            className={classes.sortButton}
            onClick={handleSortClick}
            startIcon={setStartIcon()}
        >
            {(selectedAnchor && selectedAnchor !== 'reset') ? selectedAnchor : 'Sort'}
        </Button>
    )
}

export default withStyles(styles)(Sort);