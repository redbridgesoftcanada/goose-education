import React, { Fragment } from 'react';
import clsx from "clsx";
import { Container, Grid } from '@material-ui/core';
import { MuiThemeBreakpoints } from '../constants/constants';
import MarkedTypography from '../components/onePirate/Typography';
import useStyles from '../styles/goose';

export default function GoosePlatform(props) {
    const classes = useStyles(props, 'studyAbroad');
    const smBreakpoint = MuiThemeBreakpoints().sm;
    const { graphics } = props;

    const filteredGraphics = Object.values(graphics).filter(graphic => typeof graphic !== 'string');
    filteredGraphics.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    return (
        <Container className={classes.wrapper} component="section">
            <Grid container>                
                {filteredGraphics.map((graphic, i) => {
                    const isBehind = i % 2 !== 0;

                    const wrapperStyle = clsx({
                        [classes.frontWrapper]: !isBehind,
                        [classes.backWrapper]: isBehind,
                    });

                    const cardStyle = clsx({
                        [classes.frontCard]: !isBehind,
                        [classes.backCard]: isBehind,
                    });

                    const contentStyle = clsx(isBehind && classes.backContent);

                    return (
                        <Fragment key={i}>
                            {!smBreakpoint ?
                                <Grid item md={3} className={wrapperStyle}>
                                    <div className={clsx(isBehind && classes.behind)}>
                                        <div className={cardStyle}>
                                            <MarkedTypography variant="h6" marked="center" className={contentStyle}>{graphic.title}</MarkedTypography>
                                            <MarkedTypography variant="h6" className={contentStyle}>{graphic.subtitle}</MarkedTypography>
                                            <MarkedTypography variant="body2">{graphic.caption}</MarkedTypography>
                                        </div>
                                    </div>
                                </Grid>
                                : 
                                <Grid item xs={12}>
                                    <div className={cardStyle}>
                                        <MarkedTypography variant="h6" marked="center" className={contentStyle}>{graphic.title}</MarkedTypography>
                                        <MarkedTypography variant="h6" className={contentStyle}>{graphic.subtitle}</MarkedTypography>
                                        <MarkedTypography variant="body2">{graphic.caption}</MarkedTypography>
                                    </div>
                                </Grid>
                            }
                        </Fragment>
                )})}
            </Grid>
        </Container>
)}
