import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Collapse, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import { AccountCircle, DeleteForever, ExitToApp, ExpandLess, ExpandMore } from '@material-ui/icons';
import { NAV_PAGES } from '../../constants/constants';

export default function NavDrawer(props) {
    const { authUser, classes, isOpen, onClose, Logout, title } = props;

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
                <ListSubheader>{title}</ListSubheader>
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
                {sPage === 'Networking' || sPage === 'Study Abroad Services' ? 
                <ListItem 
                    button 
                    component={RouterLink} 
                    to={{ 
                        pathname: sPage === 'Networking' ? '/networking' : '/studyabroad', 
                        state: { title: sPage, selected: 0 }}}>
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


function generateNestedPages(classes, sPage, navMenu, navManuItemHandler) { 
    const config = configPageSubsections(sPage, {}, '');
    return config.subsections.map((section, i) => {
        const { path } = configPageSubsections(sPage, config, section);
        return (
            <Collapse key={i} 
                in={navMenu[sPage]} 
                timeout='auto' 
                unmountOnExit>
                <ListItem 
                    button 
                    className={classes.navDrawerMenuItems} 
                    to={path} 
                    component={RouterLink} 
                    onClick={event => navManuItemHandler(event.currentTarget.id)}>
                    <ListItemText primary={section}/>
                </ListItem>
            </Collapse>
    )});
}

function configPageSubsections(sitePage, configPages, section) {
    let config;
    if (Object.keys(configPages).length === 0) config = {};
    config = configPages;

    switch(sitePage){
        case 'Goose Study Abroad':
            config.subsections = ['Goose Study Abroad', 'Goose Tips'];
            config.path = { 
                pathname: '/goose', 
                state: {
                    title: 'Goose Study Abroad',
                    ...(section && {
                        selected: (section === 'Goose Study Abroad') ? 0 : 1 })
                }
            }
            break;
        
        case 'School Information':
            config.subsections = ['School Information', 'School Application'];
            config.path = {
                pathname: '/schools', 
                state: {
                  title: 'School Information',
                  ...(section && {
                    selected: (section === 'School Information') ? 0 : 1 })
                }
            }
            break;
        case 'Service Centre':
            config.subsections = ['Announcements', 'Message Board'];
            config.path = {
                pathname: '/services', 
                state: {
                  title: 'Service Centre',
                  ...(section && {
                    tab: (section === 'Announcements') ? 0 : 1 })
                }
            }
            break;
           
        default:
            config.subsections = [];
            break;
    }
    return config;
}