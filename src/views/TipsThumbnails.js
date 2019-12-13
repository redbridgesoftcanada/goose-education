import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Redirect } from "react-router-dom";

const styles = theme => ({
    root: {
        overflow: 'hidden',
    },
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    background: {
        color: theme.palette.common.white,
        backgroundColor: '#bf1f22',
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '25%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3, 5),
        textAlign: 'left'
    },
    title: {
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    titleWhite: {
        color: theme.palette.common.white,
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3, 2),
        "&:hover": {
            // color: theme.palette.secondary.main,
            cursor: 'pointer'
        },
    },
    button: {
        marginTop: '1.5em',
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
    buttonWhite: {
        marginTop: '1.5em',
        color: theme.palette.common.white,
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
    }
});

function ProductValues(props) {
    const { classes, previewSchools, previewTips } = props;

    const [ pathname, setPathname ] = useState({});

    const handleClick = (event) => {
        switch(event.currentTarget.id) {            
            case 'goose_tips':
                setPathname({
                    pathname: '/goose', 
                    state: {
                        title: 'Goose Tips',
                        selected: 1
                    }
                });
                break;
            
            default:
                let selectedSchool = previewSchools.find(school => school.id.toString() === event.currentTarget.id);
                setPathname({
                    pathname: `/schools/${selectedSchool.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                    state: {
                        title: 'School Information',
                        selected: 0,
                        selectedSchool: selectedSchool
                    }
                });
                break;
        }
    }

    return (
        <section className={classes.root}>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <div className={classes.header}>
                        <Typography variant="h4" className={classes.title}>
                            School Information
                        </Typography>
                        { (Object.entries(pathname).length) ? 
                            <Redirect push to={pathname}/>
                            :
                            <IconButton id='school_information' className={classes.button} onClick={handleClick}>
                                <AddIcon />
                            </IconButton>
                        }
                    </div>
                    <Grid item xs={12} md={12} className={classes.container}>
                        {previewSchools.map(school => {
                            return (
                                <div key={school.id} className={classes.item}>
                                    <img
                                        className={classes.image}
                                        src={require(`../assets/img/${school.image}`)}
                                        alt="School Logo"
                                    />
                                    <div id={school.id} className={classes.description} onClick={handleClick}>
                                    { (Object.entries(pathname).length) ? 
                                        <Redirect push to={pathname}/>
                                        :
                                        <>
                                            <Typography variant="subtitle1">
                                                {school.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {school.features}
                                            </Typography>
                                            <Typography variant="body2">
                                                *2019-03-20
                                            </Typography>
                                        </>
                                    }
                                    </div>
                                </div>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} className={classes.background}>
                <div className={classes.header}>
                        <Typography variant="h4" className={classes.titleWhite}>
                            Goose Tips
                        </Typography>
                        { (Object.entries(pathname).length) ? 
                            <Redirect push to={pathname}/>
                            :
                            <IconButton id='goose_tips' className={classes.buttonWhite} onClick={handleClick}>
                                <AddIcon />
                            </IconButton>
                        }
                    </div>
                    <Grid item xs={12} md={12} className={classes.container} >
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../assets/img/6_copy_14_2_copy_6_1_copy_2_2948936627_zlcboNC3_e1e0cdafaaf268f678768639069a77d6921aba1e.jpg")}
                                alt="article-thumbnail"
                            />
                            <div id='goose_tips' className={classes.description} onClick={handleClick}>
                                {previewTips.map(tip => {
                                    return (
                                        (Object.entries(pathname).length) ? 
                                            <Redirect push to={pathname}/>
                                            :
                                            <div key={tip.id}>
                                                <Typography variant="subtitle1">
                                                    {tip.title}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {tip.description}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {tip.date}
                                                </Typography>
                                            </div>
                                        
                                       
                                    )
                                })}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </section>
    );
}

ProductValues.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);