import React from 'react';
import { Button } from '@material-ui/core';
import { FilterList, HighlightOffOutlined } from '@material-ui/icons';
import { MuiThemeBreakpoints } from '../constants/constants';
import useStyles from '../styles/constants';

export default function FilterButton(props) {
    const classes = useStyles(props, 'buttons');
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const { isFilter, handleFilterClick, handleFilterReset } = props;

    const notFiltered = {
        onClick: handleFilterClick, 
        startIcon: <FilterList/>,
        ...!xsBreakpoint && { children: 'Filter' }
    };
    
    const isFiltered = {
        onClick: handleFilterReset, 
        startIcon: <HighlightOffOutlined/>,
        ...!xsBreakpoint && { children: 'Clear' }
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