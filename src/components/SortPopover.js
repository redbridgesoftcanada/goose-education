import React from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { ScheduleOutlined, PowerSettingsNewOutlined, VisibilityOutlined } from '@material-ui/icons';

function SortPopover(props) { 
    const { anchorEl, open, onClose } = props;

    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={onClose}
        >
            <MenuItem id="reset" onClick={onClose}>
                <ListItemIcon>
                    <PowerSettingsNewOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Reset"/>
            </MenuItem>
            <MenuItem id="date" onClick={onClose}>
                <ListItemIcon>
                    <ScheduleOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Date"/>
            </MenuItem>
            <MenuItem id="views" onClick={onClose}>
                <ListItemIcon>
                    <VisibilityOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Views"/>
            </MenuItem>
        </Menu>
    )
}

export default SortPopover;