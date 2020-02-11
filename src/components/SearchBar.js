import React from 'react';
import { Button, Container, MenuItem, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import withRoot from '../withRoot';

const searchCategories = ['All', 'Goose Study Abroad', 'Networking', 'School Information', 'Study Abroad Services', 'Service Centre'];
const searchOptions = ['Title', 'Contents', 'Title + Contents', 'Author'];   // 'Author (코)', 'Member ID', 'Member ID (코)';
const searchConjunctions = ["And", "Or"];

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
            {searchCategories.map((option, i) => (
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
            {searchOptions.map((option, i) => (
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
                {searchConjunctions.map((option, i) => (
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