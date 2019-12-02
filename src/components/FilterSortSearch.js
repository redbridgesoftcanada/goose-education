import React from 'react';
import { Button, InputAdornment, InputBase, withStyles } from '@material-ui/core';
import { SearchOutlined, UnfoldMoreOutlined } from '@material-ui/icons';

const styles = theme => ({
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

function FilterSortSearch(props) {
    const { classes, handleClick, handleClickOpen } = props;

    return (
        <div>
            <InputBase
                className={classes.search}
                placeholder="Enter a search term"
                endAdornment={
                    <InputAdornment>
                        <Button className={classes.searchButton}>
                            Search
                        </Button>
                    </InputAdornment>
                }
            />
            <Button 
                className={classes.filterButton} 
                onClick={handleClickOpen}
                startIcon={<SearchOutlined/>}
            >
                Filter
            </Button>
            <Button 
                className={classes.filterButton} 
                onClick={handleClick}
                startIcon={<UnfoldMoreOutlined/>}
            >
                Sort
            </Button>
        </div>
    )
}

export default withStyles(styles)(FilterSortSearch);