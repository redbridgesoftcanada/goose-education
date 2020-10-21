import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import { Grid, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { format } from 'date-fns';
import { useStyles } from '../styles/home';

export default function FeatureOthers(props) {
    const classes = useStyles(props, 'featureOthers');
    const { previewSchools, previewTips, whiteWrapperText, redWrapperText } = props;
    
    const [ redirectPath, setRedirectPath ] = useState({});

    const handleClick = event => {
        switch(event.currentTarget.id) {        
            case 'school_information':
                setRedirectPath({
                    pathname: '/schools', 
                    state: { title: 'School Information', selected: 0 }
                });
                break;
        
            case 'goose_tips':
                setRedirectPath({
                    pathname: '/goose', 
                    state: { title: 'Goose Tips', selected: 1 }
                });
                break;

            default:
                const selectedSchool = previewSchools.find(school => school.id.toString() === event.currentTarget.id);
                const selectedTip = previewTips.find(tip => tip.id.toString() === event.currentTarget.id);
                if (selectedSchool) {
                    setRedirectPath({
                        pathname: `/schools`, 
                        state: { title: 'School Information', selected: 0, selectedSchool }
                    });
                } else if (selectedTip) {
                    setRedirectPath({
                        pathname: `/goose`, 
                        state: { title: 'Goose Tips', selected: 1, selectedTip }
                    });
                }
        }
    }

    return (
        Object.keys(redirectPath).length ? 
            <Redirect push to={redirectPath}/>
            :
            <section className={classes.root}>
                <Grid container>
                    {generateFeatureSchools(classes, whiteWrapperText, previewSchools, handleClick)}
                    {generateFeatureTips(classes, redWrapperText, previewTips, handleClick)}
                </Grid>
            </section>
    );
}

function generateFeatureSchools(classes, customText, previewSchools, clickHandler) {
    return (
        <Grid item xs={12} md={6}>
            <div className={classes.header}>
                <Typography className={classes.titleLeft}>{customText.title}</Typography>
                <IconButton id='school_information' className={classes.button} onClick={clickHandler}>
                    <AddIcon />
                </IconButton>
            </div>

            <Grid item xs={12} md={12} className={classes.container}>
                {previewSchools.map(school => {
                    return (
                        <div key={school.id} className={classes.item}>
                            <img
                                className={classes.image}
                                src={school.image}
                                alt="school logo" />
                            <div id={school.id} className={classes.description} onClick={clickHandler}>
                                <Typography variant="subtitle1">{school.title}</Typography>
                                <Typography variant="body2">{school.features}</Typography>
                                <Typography variant="body2">
                                    {(school.updatedAt > school.createdAt) ? format(school.updatedAt, 'yyyy-MM-dd') : format(school.createdAt, 'yyyy-MM-dd')}
                                </Typography>
                            </div>
                        </div>
                    )
                })}
            </Grid>
        </Grid>
    )
}

function generateFeatureTips(classes, customText, previewTips, clickHandler) {
    return (
        <Grid item xs={12} md={6} className={classes.rightBackground}>
            <div className={classes.header}>
                <Typography className={classes.titleRight}>
                    {customText.title}
                </Typography>
                    <IconButton id='goose_tips' className={classes.buttonWhite} onClick={clickHandler}>
                        <AddIcon />
                    </IconButton>
            </div>
            <Grid item xs={12} md={12} className={classes.container} >
                {previewTips.map(tip => {
                    return (
                        <div key={tip.id} className={classes.item}>
                            <img
                                className={classes.image}
                                src={tip.image}
                                alt="tip thumbnail" />
                            <div id={tip.id} className={classes.description} onClick={clickHandler}>
                                <div>
                                    <Typography variant="subtitle1">{tip.title}</Typography>
                                    <Typography variant="body2">{tip.description}</Typography>
                                    <Typography variant="body2">
                                        {(tip.updatedAt > tip.createdAt) ? format(tip.updatedAt, 'yyyy-MM-dd') : format(tip.createdAt, 'yyyy-MM-dd')}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Grid>
        </Grid>
    )
}