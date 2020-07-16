import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Collapse, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import { AccountCircle, DeleteForever, ExitToApp, ExpandLess, ExpandMore } from '@material-ui/icons';
import { NAV_PAGES } from '../constants/constants';

export default function NavDrawer(props) {
    const { authUser, classes, isOpen, onClose, Logout } = props;

    const [ navMenu, setNavMenu ] = useState(false);
    const [ navMenuItem, setNavMenuItem ] = useState(false);

    const selectedNavMenu = menuId => setNavMenu({ [menuId]: !navMenu[menuId] });

    const selectedNavMenuItem = itemId => {
        setNavMenuItem({ [itemId]: !navMenuItem[itemId] });
        onClose(false);
    }

    const isAdmin = authUser.roles['admin'];
    const userPages = isAdmin ? ['Dashboard'] : ['My Page', 'Change Information', 'Delete Account'];
    const sitePages = NAV_PAGES.slice(1);

    return (
        <Drawer anchor='right' open={isOpen} onClose={onClose}>
            <List>
                <ListItem>{Logout}</ListItem>
                {generateUserPageList(isAdmin, userPages)}
                <Divider/>
                <ListSubheader>Navigation</ListSubheader>
                {generateSitePageList(classes, sitePages, navMenu, selectedNavMenu, selectedNavMenuItem)}
            </List>
        </Drawer>
    )
}

function generateUserPageList(isAdmin, userPages) {    
    return userPages.map((page, i) => {
        const { icon, path } = configUserPage(isAdmin, i);
        return (
            <ListItem key={i}
                button
                component={RouterLink} 
                to={path}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={page} />
            </ListItem>
)})}

function configUserPage(isAdmin, index) {
    const config = {};
    if (index === 0) {
        config.path = isAdmin ? '/admin' : '/profile';
        config.icon = <AccountCircle/>;
    
    } else if (index === 1) {
        config.path = '/profile/edit';
        config.icon = <ExitToApp/>;
    
    } else {
        config.path = '/';
        config.icon = <DeleteForever/>;
    }
    return config;
}

function generateSitePageList(classes, sitePages, navMenu, navMenuHandler, navManuItemHandler) {
    return sitePages.map((sPage, i) => {
        const isSubsectionOpen = navMenu[sPage];
        return (
            <Fragment key={i}>
                {sPage === 'Networking' ? 
                <ListItem 
                    button 
                    component={RouterLink} 
                    to={{ pathname: '/networking', state: { title: 'Networking', selected: 0 }}}>
                    <ListItemText primary={sPage}/>
                </ListItem>
                :
                <ListItem 
                    button 
                    id={sPage} 
                    onClick={event => navMenuHandler(event.currentTarget.id)}>
                    <ListItemText primary={sPage}/>
                    {isSubsectionOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                }
                {generateNestedPages(classes, sPage, navMenu, navManuItemHandler)}
            </Fragment>
)})}

function generatePageSubsections(sitePage) {
    const nestedPages = [];
    switch(sitePage){
        case 'Goose Study Abroad':
            nestedPages.push('Goose Study Abroad', 'Goose Tips');
            break;
        case 'School Information':
            nestedPages.push('School Information', 'School Application');
            break;
        case 'Study Abroad Services':
            nestedPages.push('Homestay', 'Airport Ride');
            break;
        case 'Service Centre':
            nestedPages.push('Announcements', 'Message Board');
            break;
        default:
            break;
    }
    return nestedPages;
}

function generateNestedPages(classes, sPage, navMenu, navManuItemHandler) { 
    const pageSubsections = generatePageSubsections(sPage);
    return pageSubsections.map((item, i) => {
        const nestedPageLink = createNestedMenuLinks(item);
        return (
            <Collapse key={i} in={navMenu[sPage]} timeout='auto' unmountOnExit>
                <ListItem button component={RouterLink} to={nestedPageLink} className={classes.navDrawerMenuItems} onClick={event => navManuItemHandler(event.currentTarget.id)}>
                    <ListItemText primary={item}/>
                </ListItem>
            </Collapse>
    )});
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
            break;
        case 'Announcements':
        case 'Message Board':
            nestedPageLink = {
                pathname: '/services', 
                state: {
                  title: 'Service Centre',
                  selected: (selectedPage === 'Announcements' ? 0 : 1)
                }
            }
            break;
        default:
            break;
    }
    return nestedPageLink;
}