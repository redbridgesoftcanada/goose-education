import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import { Grid, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { format } from 'date-fns';

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

function SplitThumbnails(props) {
    const {classes, previewSchools, previewTips, whiteWrapperText, redWrapperText} = props;

    const [ redirectPath, setRedirectPath ] = useState({});

    const handleClick = event => {
        switch(event.currentTarget.id) {        
            case 'school_information':
                setRedirectPath({
                    pathname: '/schools', 
                    state: { title: 'School Information', tab: 0 }
                });
                break;
        
            case 'goose_tips':
                setRedirectPath({
                    pathname: '/goose', 
                    state: { title: 'Goose Tips', selected: 1 }
                });
                break;
            
            default:
                let selectedSchool = previewSchools.find(school => school.id.toString() === event.currentTarget.id);
                setRedirectPath({
                    pathname: `/schools/${selectedSchool.title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()}`, 
                    state: { title: 'School Information', selected: 0, selectedSchool }
                });
        }
    }

    return (
        <section className={classes.root}>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <div className={classes.header}>
                        <Typography variant="h4" className={classes.title}>
                            {whiteWrapperText.title}
                        </Typography>
                        { (Object.entries(redirectPath).length) ? 
                            <Redirect push to={redirectPath}/>
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
                                    { (Object.entries(redirectPath).length) ? 
                                        <Redirect push to={redirectPath}/>
                                        :
                                        <>
                                            <Typography variant="subtitle1">
                                                {school.title}
                                            </Typography>
                                            <Typography variant="body2">
                                                {school.features}
                                            </Typography>
                                            <Typography variant="body2">
                                                {(school.updatedAt > school.createdAt) ? format(school.updatedAt, 'yyyy-MM-dd') : format(school.createdAt, 'yyyy-MM-dd')}
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
                            {redWrapperText.title}
                        </Typography>
                        { (Object.entries(redirectPath).length) ? 
                            <Redirect push to={redirectPath}/>
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
                                        (Object.entries(redirectPath).length) ? 
                                            <Redirect key={tip.id} push to={redirectPath}/>
                                            :
                                            <div key={tip.id}>
                                                <Typography variant="subtitle1">
                                                    {tip.title}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {tip.description}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {(tip.updatedAt > tip.createdAt) ? format(tip.updatedAt, 'yyyy-MM-dd') : format(tip.createdAt, 'yyyy-MM-dd')}
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

export default withStyles(styles)(SplitThumbnails);