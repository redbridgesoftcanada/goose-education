import React, { useState } from 'react';
import { Link as RouterLink, withRouter } from "react-router-dom";
import { Button, CardMedia, Collapse, Container, Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import parse from 'html-react-parser';
import { convertToSentenceCase } from '../constants/helpers/_features';
import { useStyles } from '../styles/schools';

const defaultMessage = "Please contact us for any further information."

function SchoolInformation(props) {
    const classes = useStyles(props, 'schoolInformation'); 
    const { selectedSchool } = props;

    const [ open, setOpen ] = useState({
        intro: true,
        features: true,
        programs: true,
        expenses: true,
        details: true,
        media: true,
        location: true,
    });

    const handleClick = event => {
        setOpen(prevState => ({...prevState, 
            [event.currentTarget.id]: !open[event.currentTarget.id]
        }));
    }

    return (
        <Container>
            <CardMedia
                component='img'
                className={classes.image}
                image={selectedSchool.image}/>
            
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableText}>Name</TableCell>
                            <TableCell className={classes.tableText}>Type</TableCell>
                            <TableCell className={classes.tableText}>Location</TableCell>
                            <TableCell className={classes.tableText}>Website</TableCell>
                            <TableCell className={classes.tableText}>Date of Establishment</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.tableText}>{selectedSchool.title ? selectedSchool.title : ''}</TableCell>
                            <TableCell className={classes.tableText}>{selectedSchool.type ? selectedSchool.type : ''}</TableCell>
                            <TableCell className={classes.tableText}>{selectedSchool.location ? selectedSchool.location : ''}</TableCell>
                            <TableCell>
                                <Typography className={classes.tableText}>
                                    <Link href={selectedSchool.url} color="inherit" target="_blank" rel="nooopener">{selectedSchool.url}</Link>
                                </Typography>
                            </TableCell>
                            <TableCell className={classes.tableText}>{selectedSchool.dateOfEstablishment ? selectedSchool.dateOfEstablishment : ''}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography className={classes.sectionHeader}>School Information</Typography>
            <List component="nav">
                {generateCollapseList(classes, 'intro', open.intro, selectedSchool.description, handleClick)}

                {generateCollapseList(classes, 'features', open.features, selectedSchool.features, handleClick)}
                
                {generateCollapseList(classes, 'programs', open.programs, selectedSchool.program, handleClick)}

                {generateCollapseList(classes, 'expenses', open.expenses, selectedSchool.expenses, handleClick)}

                <ListItem button divider id="details" onClick={handleClick}>
                    <ListItemText primary="Additional Details" primaryTypographyProps={{className: classes.header}} />
                    {open.details ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open.details} timeout="auto" unmountOnExit>
                    <List component="div">
                        <ListItem disableGutters>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {selectedSchool.numberOfStudents ? <TableCell className={classes.tableText}>Number of Students</TableCell> : '' }
                                            {selectedSchool.openingProcess ? <TableCell className={classes.tableText}>Opening Process</TableCell> : '' }
                                            {selectedSchool.accommodation ? <TableCell className={classes.tableText}>Accommodation</TableCell> : '' }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {selectedSchool.numberOfStudents ? <TableCell className={classes.tableText}>{selectedSchool.numberOfStudents}</TableCell> : ''}
                                            {selectedSchool.openingProcess ? <TableCell className={classes.tableText}>{selectedSchool.openingProcess}</TableCell> : '' }
                                            {selectedSchool.accommodation ? <TableCell className={classes.tableText}>{selectedSchool.accommodation}</TableCell> : '' }
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ListItem>
                    </List>
                </Collapse>
            </List>

            <Typography className={classes.sectionHeader}>School Guide</Typography>
                <List component="nav">
                    {generateCollapseList(classes, 'googleMaps', open.location, selectedSchool.googleUrl, handleClick)}

                    {generateCollapseList(classes, 'media', open.media, selectedSchool.youtubeUrl, handleClick)}
                </List>
                <Button
                    color="secondary" 
                    variant="contained" 
                    fullWidth
                    component={RouterLink} 
                    to={{
                        pathname: `/schools`, 
                        state: {
                            title: 'School Information',
                            selected: 1
                        }
                    }}>
                    Apply Here
                </Button>
        </Container>
    )
}

function generateCollapseList(classes, id, isOpen, content, clickListener){
    let collapseChildren;
    if (id === 'media') {
        collapseChildren = content.map(video => {
            return (
            <ListItem className={classes.video} key={video}>
                {parse(video)}
            </ListItem>
            )
        })
    } else if (id === 'googleMaps') {
        collapseChildren =
            <ListItem className={classes.video}>
                {parse(content)}
            </ListItem>
    } else {
        collapseChildren = 
            <ListItem>
                <ListItemText 
                primary={content ? content : defaultMessage}
                primaryTypographyProps={{className: classes.listText}} />
            </ListItem>
    }
    
    return (
        <>
            <ListItem 
                button 
                divider 
                id={id}
                onClick={clickListener}>
                <ListItemText 
                    primary={(id !== 'intro') ? convertToSentenceCase(id) : 'Introduction'} 
                    primaryTypographyProps={{className: classes.header}} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div">
                    {collapseChildren}
                </List>
            </Collapse>
        </>
    )
}

export default withRouter(SchoolInformation);