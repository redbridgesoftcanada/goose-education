import React from 'react';
import { Button, InputAdornment, Input, withStyles } from '@material-ui/core';

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
});

function SearchField(props) {
    const { classes, handleSearch, handleSearchClick } = props;

    return (
        <Input
            className={classes.search}
            placeholder="Enter a search term"
            disableUnderline
            onChange={handleSearch}
            endAdornment={
                <InputAdornment>
                    <Button className={classes.searchButton} onClick={handleSearchClick}>
                        Search
                    </Button>
                </InputAdornment>
            }
        />
    )
}

export default withStyles(styles)(SearchField);