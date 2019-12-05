import React, { useState } from 'react';
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
    const { classes, selectedSchool } = props;
    const defaultMessage = "Please contact us for any further information.";

    const [state, setState] = useState({
        intro: true,
        features: true,
        programs: true,
        expenses: true,
        details: true,
        media: true,
    });

    const { intro, features, programs, expenses, details, media } = state;
    
    const handleClick = (event) => {
        switch (event.currentTarget.id) {
            case 'intro':
                handleIntroClick();
                break;
            case 'features':
                handleFeaturesClick();
                break;
            case 'programs':
                handleProgramsClick();
                break;
            case 'expenses':
                handleExpensesClick();
                break;
            case 'details':
                handleDetailsClick();
                break;
            case 'media': 
                handleMediaClick();
                break;
        }
    };

    const handleIntroClick = () => setState({...state, intro: !intro});
    const handleFeaturesClick = () => setState({...state, features: !features});
    const handleProgramsClick = () => setState({...state, programs: !programs});
    const handleExpensesClick = () => setState({...state, expenses: !expenses});
    const handleDetailsClick = () => setState({...state, details: !details});
    const handleMediaClick = () => setState({...state, media: !media});

    return (
        <>
        <Container>
            <img
                className={classes.image}
                src={require(`../assets/img/${selectedSchool.image}`)}
                alt='school logo'
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
                        <TableCell align='center'>{selectedSchool.name}</TableCell>
                        <TableCell align='center'>{selectedSchool.type}</TableCell>
                        <TableCell align='center'>{selectedSchool.location}</TableCell>
                        <TableCell align='center'>{selectedSchool.url}</TableCell>
                        <TableCell align='center'>{selectedSchool.dateOfEstablishment}</TableCell>
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
                            <ListItemText primary={(selectedSchool.introduction.length) ? selectedSchool.introduction : defaultMessage}/>
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
                            <ListItemText primary={(selectedSchool.features.length) ? selectedSchool.features : defaultMessage} />
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
                            <ListItemText primary={(selectedSchool.program.length) ? selectedSchool.program : defaultMessage} />
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
                            <ListItemText primary={(selectedSchool.expenses.length) ? selectedSchool.expenses : defaultMessage} />
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
                                        {(selectedSchool.numberOfStudents.length) ? <TableCell align='center'>Number of Students</TableCell> : '' }
                                        {(selectedSchool.numberOfStudents.length) ? <TableCell align='center'>Opening Process</TableCell> : '' }
                                        {(selectedSchool.numberOfStudents.length) ? <TableCell align='center'>Accommodation</TableCell> : '' }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        {(selectedSchool.numberOfStudents.length) ? <TableCell align='center'>{selectedSchool.numberOfStudents}</TableCell> : ''}
                                        {(selectedSchool.numberOfStudents.length) ? <TableCell align='center'>{selectedSchool.openingProcess}</TableCell> : '' }
                                        {(selectedSchool.numberOfStudents.length) ? <TableCell align='center'>{selectedSchool.accommodation}</TableCell> : '' }
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </ListItem>
                        <ListItem>
                            Embedded Google Maps: {(selectedSchool.googleUrl.length) ? selectedSchool.googleUrl : ''}
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
                                    <ListItem className={classes.video}>
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
                <Button
                    color="secondary"
                    variant="contained"
                    size="medium"
                    className={classes.button}
                    // component="a"
                    // href="/premium-themes/onepirate/sign-up/"
                    >
                    Apply Here
                </Button>
        </Container>
        </>
    )
}

export default withStyles(styles)(SchoolInformation);