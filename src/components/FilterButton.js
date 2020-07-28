import React from 'react';
import { Button, useMediaQuery, useTheme, withStyles } from '@material-ui/core';
import { HighlightOffOutlined, SearchOutlined } from '@material-ui/icons';

const styles = theme => ({
    root: {
        float: 'left',
        marginRight: theme.spacing(1),
        "& .MuiButton-startIcon": {
            [theme.breakpoints.down('sm')]: {
                marginRight: 0
            }
        }
    }
});

function FilterButton(props) {
    const theme = useTheme();
    const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
    const { classes, isFilter, handleFilterClick, handleFilterReset } = props;

    const notFiltered = {
        onClick: handleFilterClick, 
        startIcon: <SearchOutlined/>,
        ...!smBreakpoint && { children: 'Filter' }
    };
    
    const isFiltered = {
        onClick: handleFilterReset, 
        startIcon: <HighlightOffOutlined/>,
        ...!smBreakpoint && { children: 'Clear' }
    };

    return (
        <Button
            className={classes.root} 
            color='secondary'
            variant='contained'
            size='medium' 
            {...isFilter ? isFiltered : notFiltered}/>
    )
}

export default withStyles(styles)(FilterButton);