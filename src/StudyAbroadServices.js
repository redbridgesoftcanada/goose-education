import React from 'react';
import { Switch, Route, Link as RouterLink, useRouteMatch, useLocation } from "react-router-dom";
import { Box, Button, Card, CardActions, CardHeader, Grid, Paper, Typography } from '@material-ui/core';
import withRoot from './withRoot';
import { MuiThemeBreakpoints } from './constants/constants';
import { AuthUserContext } from './components/session';
import { DatabaseContext } from './components/database';
import Poster from './components/Poster';
import HomestayProcess from './components/HomestayProcess';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';
import StudyAbroadServiceApplication from './views/StudyAbroadServiceApplication';
import { useStyles } from './styles/studyAbroad';

function StudyAbroadServices(props) {
    const classes = useStyles(props, 'studyAbroadInformation'); 
    const match = useRouteMatch();
    const location = useLocation();
    const xsBreakpoint = MuiThemeBreakpoints().xs;

    return (
        <>
            <ResponsiveNavBars/>
            <Paper>
                <Switch>
                    <Route path={[`${match.path}/homestay`, `${match.path}/airport`]}>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? 
                                <>
                                    <Typography variant='h6'>{location.pathname.includes('homestay') ? 'Homestay Application' : 'Airport Ride Application'}</Typography>
                                    <StudyAbroadServiceApplication authUser={authUser} /> 
                                </>
                                : 
                                <Box py={10}>
                                    <Typography variant='h6'>{location.pathname.includes('homestay') ? 'Homestay Application' : 'Airport Ride Application'}</Typography>
                                    <Typography variant='subtitle1'>Please Register or Login to Apply</Typography> 
                                </Box>
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
                                        {generateHelperCards(classes, studyabroadGraphics.homestayBanner.title, studyabroadGraphics.homestayBanner.caption, match.path, xsBreakpoint)}
                                        {generateHelperCards(classes, studyabroadGraphics.airportRideBanner.title, studyabroadGraphics.airportRideBanner.caption, match.path, xsBreakpoint)}
                                        {!xsBreakpoint && <Grid item sm={1} md={2}/>}
                                    </Grid>
                                </Box>
                            }
                        </DatabaseContext.Consumer>                           
                    </Route>
                </Switch>
            
                <Box 
                {...(location.pathname.includes('homestay') || location.pathname.includes('airport')) && { marginTop: 6 }}>
                    <DatabaseContext.Consumer>
                        {({ state: { studyabroadGraphics: { homestayBannerProcess = {} } = {} } }) => 
                            <HomestayProcess body={homestayBannerProcess}/>}
                    </DatabaseContext.Consumer>
                </Box>
            </Paper>
            <ResponsiveFooters/>
        </>
    )
}

function generateHelperCards(classes, title, caption, path, breakpoint) {
    const redirectPath = title.includes('Homestay') ? `${path}/homestay` : `${path}/airport`;

    return (
        <Grid item xs={6} sm={5} md={4}>
            <Card>
                <CardHeader
                    className={classes.cardHeader}
                    title={title}
                    titleTypographyProps={{className: classes.cardTitle}}
                    {...!breakpoint && {
                        subheader:caption,
                        subheaderTypographyProps: {className: classes.cardCaption}
                    }}
                />
                <CardActions className={classes.applyButton}>
                    <Button 
                        {...title.includes('Homestay') && { color:"secondary" }}
                        size="medium"
                        component={RouterLink} 
                        to={redirectPath}>
                            Apply Here
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default withRoot(StudyAbroadServices);