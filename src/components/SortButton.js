import React from 'react';
import { Button, useMediaQuery, useTheme } from '@material-ui/core';
import { ScheduleOutlined, VisibilityOutlined, UnfoldMoreOutlined } from '@material-ui/icons';
import useStyles from '../styles/constants/index';

export default function SortButton(props) {
    const classes = useStyles(props, 'buttons');
    const theme = useTheme();

    const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));
    const { selectedAnchor, handleSortClick} = props;

    const buttonProps = {};
    const configButtonProps = () => {
        switch(selectedAnchor) {
            case 'date':
                buttonProps.startIcon = <ScheduleOutlined/>;
                buttonProps.children = 'Date';
                break;

            case 'views':
                buttonProps.startIcon = <VisibilityOutlined/>;
                buttonProps.children = 'Views';
                break; 

            default:
                buttonProps.startIcon = <UnfoldMoreOutlined/>;
                buttonProps.children = 'Sort';
        }
        
        if (xsBreakpoint) buttonProps.children = '';
        return buttonProps;
    }

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