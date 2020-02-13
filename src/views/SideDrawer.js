import React, { Fragment } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Collapse, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import { AccountCircle, DeleteForever, ExitToApp, ExpandLess, ExpandMore } from '@material-ui/icons';
import Logout from '../components/navlinks/Logout';

const userMenuItems = ['My Page', 'Change Information', 'Delete Account'];
const pageMenuItems = ['Study Abroad', 'Networking', 'School Information', 'Study Abroad Services', 'Service Centre'];

function createNestedMenuItems(menuPage) {
    let nestedPageMenuItems = [];
    switch(menuPage){
        case 'study_abroad':
            nestedPageMenuItems.push('Goose Study Abroad', 'Goose Tips');
            break;
        case 'school_information':
            nestedPageMenuItems.push('School Information', 'School Application');
            break;
        case 'study_abroad_services':
            nestedPageMenuItems.push('Homestay', 'Airport Ride');
            break;
        case 'service_centre':
            nestedPageMenuItems.push('Announcements', 'Message Board');
            break;
        default:
            break;
    }
    return nestedPageMenuItems;
}

function createNestedMenuLinks(selectedPage) {
    let nestedPageLink = {};
    switch (selectedPage) {
        case 'Goose Study Abroad':
        case 'Goose Tips':
            nestedPageLink = {
                pathname: '/goose', 
                state: {
                  title: 'Goose Study Abroad',
                  selected: (selectedPage === 'Goose Study Abroad' ? 0 : 1)
                }
            }
            break;
        case 'School Information':
        case 'School Application':
            nestedPageLink = {
                pathname: '/schools', 
                state: {
                  title: 'School Information',
                  selected: (selectedPage === 'School Information' ? 0 : 1)
                }
            }
            break;
        case 'Homestay':
        case 'Airport Ride':
            nestedPageLink = {
                pathname: '/studyabroad', 
                state: {
                  title: 'Study Abroad',
                  selected: (selectedPage === 'Homestay' ? 0 : 1)
                }
            }
        case 'Announcements':
        case 'Message Board':
            nestedPageLink = {
                pathname: '/services', 
                state: {
                  title: 'Service Centre',
                  selected: (selectedPage === 'Announcements' ? 0 : 1)
                }
            }
        default:
            break;
    }
    return nestedPageLink;
}

export default function SideDrawer(props) {
    const { authUser, classes, isOpen, handleClick, onClose, state } = props;
    const user = {
        username: authUser.displayName,
        email: authUser.email
    };
    return (
        <Drawer anchor='right' open={isOpen} onClose={onClose}>
            <List>
                <ListItem>
                    <Logout classes={classes}/>
                </ListItem>
                {userMenuItems.map((text, index) => (
                    <ListItem
                    button
                    component={RouterLink} 
                    to={index === 0 ? '/profile' : index === 1 ? { pathname: '/profile/edit', state: { user }} : '/' } 
                    key={text}>
                        <ListItemIcon>
                            {index === 0 ? <AccountCircle /> : index === 1 ? <ExitToApp /> : <DeleteForever /> }
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
                <Divider/>
                <ListSubheader>Navigation</ListSubheader>
                {pageMenuItems.map ((item, i) => {
                    const formattedText = item.toLowerCase().replace(/ /g,"_");
                    const nestedPageMenuItems = createNestedMenuItems(formattedText);
                    return (
                        <Fragment key={i}>
                            {formattedText === 'networking' ? 
                            <ListItem button component={RouterLink} to={{ pathname: '/networking', state: { title: 'Networking' }}}>
                                <ListItemText primary={item}/>
                            </ListItem>
                            :
                            <ListItem button id={item} onClick={handleClick}>
                                <ListItemText primary={item}/>
                                {(formattedText !== 'networking' && state[formattedText]) ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            }
                            {nestedPageMenuItems.map((item, i) => {
                                const nestedPageLink = createNestedMenuLinks(item);
                                return (
                                    <Collapse key={i} in={state[formattedText]} timeout='auto' unmountOnExit>
                                        <ListItem button component={RouterLink} to={nestedPageLink} className={classes.nested}>
                                            <ListItemText primary={item}/>
                                        </ListItem>
                                    </Collapse>
                            )})}
                        </Fragment>
                )})}
            </List>
        </Drawer>
    )
}