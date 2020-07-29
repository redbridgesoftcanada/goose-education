import React, { useState } from 'react';
import { Button, Collapse, InputAdornment, Input, useMediaQuery, useTheme } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import useStyles from '../styles/constants';

export default function SearchField(props) {
    const classes = useStyles(props, 'buttons');
    const { handleSearch, handleSearchClick } = props;

    const theme = useTheme();
    const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));

    const [ open, setOpen ] = useState(false);
    const triggerCollapse = () => setOpen(open => !open);

    const searchInput = 
        <Input
            className={classes.search}
            placeholder="Enter a search term"
            disableUnderline
            onChange={handleSearch}
            endAdornment={
                <InputAdornment>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSearchClick}>
                        Search
                    </Button>
                </InputAdornment>}
        />

    return (
        <>
            {xsBreakpoint ?
                <>
                    <Button
                        className={classes.condenseSearch}
                        variant="contained"
                        color="secondary"
                        onClick={triggerCollapse}
                        startIcon={<SearchOutlined/>}/>

                    <Collapse 
                        className={classes.condenseContainer} 
                        in={open} 
                        timeout="auto" 
                        unmountOnExit>
                            {searchInput}
                    </Collapse>
                </>
                :
                searchInput
            }
        </>
    )
}