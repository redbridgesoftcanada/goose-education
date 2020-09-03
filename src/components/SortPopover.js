import React from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { ScheduleOutlined, PowerSettingsNewOutlined, VisibilityOutlined } from '@material-ui/icons';
import useStyles from '../styles/constants';

export default function SortPopover(props) { 
    const classes = useStyles(props, 'buttons');
    const { anchorEl, open, onClose } = props;

    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={onClose}>
            <MenuItem className={classes.popoverItem} id="reset" onClick={onClose}>
                <ListItemIcon>
                    <PowerSettingsNewOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Reset"/>
            </MenuItem>
            <MenuItem className={classes.popoverItem} id="date" onClick={onClose}>
                <ListItemIcon>
                    <ScheduleOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Date"/>
            </MenuItem>
            {/* <MenuItem className={classes.popoverItem} id="views" onClick={onClose}>
                <ListItemIcon>
                    <VisibilityOutlined fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Views"/>
            </MenuItem> */}
        </Menu>
    )
}