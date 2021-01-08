import React from 'react';
import { Button } from '@material-ui/core';
import { ScheduleOutlined, UnfoldMoreOutlined } from '@material-ui/icons';
import { MuiThemeBreakpoints } from '../constants/constants';
import useStyles from '../styles/constants/index';

export default function SortButton(props) {
    const { selectedAnchor, handleSortClick } = props;

    const buttonProps = {};
    const configButtonProps = () => {
        switch(selectedAnchor) {
            case 'date':
                buttonProps.startIcon = <ScheduleOutlined/>;
                buttonProps.children = 'Date';
                break;

            default:
                buttonProps.startIcon = <UnfoldMoreOutlined/>;
                buttonProps.children = 'Sort';
        }
        
        if (xsBreakpoint) buttonProps.children = '';
        return buttonProps;
    }

    const classes = useStyles(props, 'buttons');
    const xsBreakpoint = MuiThemeBreakpoints().xs;

    return (
        <Button
            className={classes.root}
            variant='contained'
            size='medium'
            color='secondary'
            onClick={handleSortClick}
            {...configButtonProps()}
        />
    )
}