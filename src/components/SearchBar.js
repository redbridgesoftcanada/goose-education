import React from 'react';
import { Button, Container, MenuItem, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import withRoot from '../withRoot';
import { NAV_PAGES, FILTER_OPTIONS, FILTER_CONJUNCTIONS } from '../constants/constants';

function SearchBar(props) {
    const { classes, handleSearchQuery, searchProps } = props;
    const { searchCategory, searchOption, searchConjunction, searchQuery } = searchProps;

    return (
        <Container className={classes.container}>
            <TextField className={classes.menu}
            select
            label="Categories"
            name="searchCategory"
            value={searchCategory}
            onChange={handleSearchQuery}
            margin="dense"
            variant="outlined"
            >
            {NAV_PAGES.map((option, i) => (
                <MenuItem key={i} value={option}>
                {option}
                </MenuItem>
            ))}
            </TextField>

            <TextField className={classes.menu}
            select
            label="Content"
            name="searchOption"
            value={searchOption}
            onChange={handleSearchQuery}
            margin="dense"
            variant="outlined"
            >
            {FILTER_OPTIONS.map((option, i) => (
                <MenuItem key={i} value={option}>
                {option}
                </MenuItem>
            ))}
            </TextField>

            <TextField className={classes.menu}
                select
                label="And/Or"
                name="searchConjunction"
                value={searchConjunction}
                onChange={handleSearchQuery}
                margin="dense"
                variant="outlined"
            >
                {FILTER_CONJUNCTIONS.map((option, i) => (
                    <MenuItem key={i} value={option}>
                    {option}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                placeholder="Search Term"
                type="search"
                name="searchQuery"
                variant="outlined"
                margin="dense"
                value={searchQuery}
                onChange={handleSearchQuery}
            />

            <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<SearchOutlined/>}
                // onClick={handleSearchClick} 
            >
                Search
            </Button>
      </Container>
    )
}

export default withRoot(SearchBar);