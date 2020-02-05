import React, { useState } from 'react';
import { Link as RouterLink, withRouter } from "react-router-dom";
import { Collapse, Container, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import parse from 'html-react-parser';
import Button from '../components/onePirate/Button';

const styles = theme => ({
    root: {
        width: '100%',
    },
    image: {
        display: 'block',
        border: '0',
        width: '100%',
        maxWidth: '35%',
        height: 'auto',
        margin: '0px auto',
    },
    header: {
        fontWeight: 600,
    },
    video: {
        justifyContent: 'center',
    },
    button: {
        minWidth: 200,
    },
});

function SchoolInformation(props) {
    
    const INITIAL_STATE = {
        intro: true,
        features: true,
        programs: true,
        expenses: true,
        details: true,
        media: true,
    }
    const defaultMessage = "Please contact us for any further information."

    const [ open, setOpen ] = useState(INITIAL_STATE);
    const { intro, features, programs, expenses, details, media } = open;

    const handleClick = event => {
        setOpen(prevState => ({
            ...prevState, 
            [event.currentTarget.id]: !open[event.currentTarget.id]
        }))
    }

    let { classes, selectedSchool } = props;
    // to access props from <Redirect /> rather than passed directly to the component;
    if (props.location.state && props.location.state.selectedSchool) selectedSchool = props.location.state.selectedSchool

    return (
        <>
            <Container>
                <img className={classes.image} alt='school logo'
                    src={require(`../assets/img/${(Object.entries(selectedSchool).length && selectedSchool.image) ? selectedSchool.image: 'flogo.png'}`)}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Name</TableCell>
                            <TableCell align='center'>Type</TableCell>
                            <TableCell align='center'>Location</TableCell>
                            <TableCell align='center'>Website</TableCell>
                            <TableCell align='center'>Date of Establishment</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align='center'>{(Object.entries(selectedSchool).length && selectedSchool.name) ? selectedSchool.name : ''}</TableCell>
                            <TableCell align='center'>{(Object.entries(selectedSchool).length && selectedSchool.type) ? selectedSchool.type : ''}</TableCell>
                            <TableCell align='center'>{(Object.entries(selectedSchool).length && selectedSchool.location) ? selectedSchool.location : ''}</TableCell>
                            <TableCell align='center'>{(Object.entries(selectedSchool).length && selectedSchool.url) ? selectedSchool.url : ''}</TableCell>
                            <TableCell align='center'>{(Object.entries(selectedSchool).length && selectedSchool.dateOfEstablishment) ? selectedSchool.dateOfEstablishment : ''}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="h6">School Information</Typography>
                <List component="nav" className={classes.root}>
                    <ListItem button divider id="intro" onClick={handleClick}>
                        <ListItemText primary="Introduction" primaryTypographyProps={{className: classes.header}} />
                        {intro ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={intro} timeout="auto" unmountOnExit>
                        <List component="div">
                            <ListItem>
                                <ListItemText primary={(Object.entries(selectedSchool).length && selectedSchool.introduction) ? selectedSchool.introduction : defaultMessage}/>
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem button divider id="features" onClick={handleClick}>
                        <ListItemText primary="Features" primaryTypographyProps={{className: classes.header}}/>
                        {features ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={features} timeout="auto" unmountOnExit>
                        <List component="div">
                            <ListItem>
                                <ListItemText primary={(Object.entries(selectedSchool).length && selectedSchool.features) ? selectedSchool.features : defaultMessage} />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem button divider id="programs" onClick={handleClick}>
                        <ListItemText primary="Program" primaryTypographyProps={{className: classes.header}}/>
                        {programs ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={programs} timeout="auto" unmountOnExit>
                        <List component="div">
                            <ListItem>
                                <ListItemText primary={(Object.entries(selectedSchool).length && selectedSchool.program) ? selectedSchool.program : defaultMessage} />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem button divider id="expenses" onClick={handleClick}>
                        <ListItemText primary="Expenses" primaryTypographyProps={{className: classes.header}}/>
                        {expenses ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={expenses} timeout="auto" unmountOnExit>
                        <List component="div">
                            <ListItem>
                                <ListItemText primary={(Object.entries(selectedSchool).length && selectedSchool.expenses) ? selectedSchool.expenses : defaultMessage} />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button divider id="details" onClick={handleClick}>
                        <ListItemText primary="Additional Details" primaryTypographyProps={{className: classes.header}} />
                        {details ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={details} timeout="auto" unmountOnExit>
                        <List component="div">
                            <ListItem disableGutters>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {(Object.entries(selectedSchool).length && selectedSchool.numberOfStudents) ? <TableCell align='center'>Number of Students</TableCell> : '' }
                                            {(Object.entries(selectedSchool).length && selectedSchool.openingProcess) ? <TableCell align='center'>Opening Process</TableCell> : '' }
                                            {(Object.entries(selectedSchool).length && selectedSchool.accommodation) ? <TableCell align='center'>Accommodation</TableCell> : '' }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {(Object.entries(selectedSchool).length && selectedSchool.numberOfStudents) ? <TableCell align='center'>{selectedSchool.numberOfStudents}</TableCell> : ''}
                                            {(Object.entries(selectedSchool).length && selectedSchool.openingProcess) ? <TableCell align='center'>{selectedSchool.openingProcess}</TableCell> : '' }
                                            {(Object.entries(selectedSchool).length && selectedSchool.accommodation) ? <TableCell align='center'>{selectedSchool.accommodation}</TableCell> : '' }
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </ListItem>
                            <ListItem>
                                Embedded Google Maps: {(Object.entries(selectedSchool).length && selectedSchool.googleUrl) ? selectedSchool.googleUrl : ''}
                            </ListItem>
                        </List>
                    </Collapse>
                </List>

                <Typography variant="h6">School Guide</Typography>
                    <List component="nav" className={classes.root}>
                        <ListItem button divider id="media" onClick={handleClick}>
                            <ListItemText primary="Media" primaryTypographyProps={{className: classes.header}} />
                            {media ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={media} timeout="auto" unmountOnExit>
                            <List component="div">
                                {(selectedSchool.youtubeUrl.length) ? 
                                    selectedSchool.youtubeUrl.map(video => {
                                        return (
                                        <ListItem className={classes.video} key={video}>
                                            {parse(video)}
                                        </ListItem>
                                        )
                                    })
                                : 
                                defaultMessage
                            }
                            </List>
                        </Collapse>
                    </List>
                    <Button className={classes.button} color="secondary" variant="contained" size="medium"
                        component={RouterLink} 
                        to=
                        {{
                            pathname: `/schools`, 
                            state: {
                                title: 'School Information',
                                selected: 1,
                            }
                        }}
                        >
                        Apply Here
                    </Button>
            </Container>
        </>
    )
}

export default withRouter(withStyles(styles)(SchoolInformation));