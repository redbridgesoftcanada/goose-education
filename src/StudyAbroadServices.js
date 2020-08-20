import React from 'react';
import { Switch, Route, Link as RouterLink, useRouteMatch } from "react-router-dom";
import { Box, Button, Card, CardActions, CardHeader, Grid, Paper, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import withRoot from './withRoot';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import { AuthUserContext } from './components/session';
import { DatabaseContext } from './components/database';
import Poster from './components/Poster';
import HomestayProcess from './components/HomestayProcess';
import StudyAbroadServiceApplication from './views/StudyAbroadServiceApplication';
import { useStyles } from './styles/studyAbroad';

function StudyAbroadServices(props) {
    const classes = useStyles(props, 'studyAbroadInformation');
    
    const match = useRouteMatch();
    
    const theme = useTheme();
    
    const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));
    const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
    const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            {ResponsiveNavBars(mdBreakpoint)}
            <Paper>
                <Switch>
                    <Route path={`${match.path}/homestay`}>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? 
                                <StudyAbroadServiceApplication authUser={authUser} /> 
                                : 
                                <Typography variant="h5">Please Register or Login to Apply</Typography> }
                        </AuthUserContext.Consumer>
                    </Route>

                    <Route path={`${match.path}/airport`}>
                        <AuthUserContext.Consumer>
                            { authUser => authUser ? 
                                <StudyAbroadServiceApplication authUser={authUser} /> 
                                : 
                                <Typography variant="h5">Please Register or Login to Apply</Typography> 
                            }
                        </AuthUserContext.Consumer>
                    </Route>

                    <Route path={match.path}>
                        <DatabaseContext.Consumer>
                            {({ state: { studyabroadGraphics = {} } }) => 
                                <Box className={classes.container}>
                                    <Poster body={studyabroadGraphics.studyAbroadPoster} backgroundImage={studyabroadGraphics.studyAbroadPoster.image} layoutType='study_abroad'/>
                                    <Grid container spacing={1} className={classes.cardContainer}>
                                        {!xsBreakpoint && <Grid item sm={1} md={2}/>}
                                        {generateHelperCards(classes, studyabroadGraphics.homestayBanner.title, studyabroadGraphics.homestayBanner.caption, match.path)}
                                        {generateHelperCards(classes, studyabroadGraphics.airportRideBanner.title, studyabroadGraphics.airportRideBanner.caption, match.path)}
                                        {!xsBreakpoint && <Grid item sm={1} md={2}/>}
                                    </Grid>
                                </Box>
                            }
                        </DatabaseContext.Consumer>                           
                    </Route>
                </Switch>
            
                <DatabaseContext.Consumer>
                    {({ state: { studyabroadGraphics: { homestayBannerProcess = {} } = {} } }) => 
                        <HomestayProcess body={homestayBannerProcess}/>}
                </DatabaseContext.Consumer>
            </Paper>
            {ResponsiveFooters(smBreakpoint)}
        </>
    )
}

function generateHelperCards(classes, title, caption, path) {
    const redirectPath = title.includes('Homestay') ? `${path}/homestay` : `${path}/airport`;

    return (
        <Grid item xs={6} sm={5} md={4}>
            <Card>
                <CardHeader
                    className={classes.cardHeader}
                    title={title}
                    subheader={caption}
                    titleTypographyProps={{className: classes.cardTitle}}
                    subheaderTypographyProps={{className: classes.cardCaption}}
                />
                <CardActions className={classes.applyButton}>
                    <Button 
                        {...title.includes('Homestay') && { color:"secondary" }}
                        size="medium"
                        component={RouterLink} 
                        to={redirectPath}>
                            Apply For {title}
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default withRoot(StudyAbroadServices);