import React from 'react';
import clsx from 'clsx';
import { Card, CardContent, Grid, Typography, useTheme, useMediaQuery } from '@material-ui/core/';
import MarkedTypography from '../components/onePirate/Typography';
import PageBannerLayout from '../views/PageBannerLayout';
import useStyles from '../styles/constants';

export default function Poster(props) {
  const theme = useTheme();
  const classes = useStyles(props, 'poster');
  const { backgroundImage, layoutType } = props;
  const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <section className={classes.background}>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='header background banner'/>
        {generatePosterContent(classes, props, xsBreakpoint)}
      </PageBannerLayout>
    </section>
  );
}

function generatePosterContent(classes, props, breakpoint) {
  const { body, layoutType } = props;
  const isCustomPosters = layoutType === 'vancouver_now' || layoutType === 'study_abroad';

  const subtitleStyles = clsx({
    [classes.subtitle]: true,
    [classes.defaultSubtitle]: !isCustomPosters,
    [classes.customSubtitle]: isCustomPosters
  })


  if (isCustomPosters) {
    return (
      <ul className={classes.customContainer}>
        <Typography className={subtitleStyles} component={'li'}>
          {body.subtitle}
         </Typography>
         <MarkedTypography className={classes.customTitle} marked="center" variant={breakpoint ? 'h4' : 'h2'} component={'li'}>
          {body.title}
         </MarkedTypography>
         <Typography className={classes.customCaption} component={'li'}>
          {body.caption}
         </Typography>
        {createPosterCards(classes, props.posterCards)}
      </ul>
    )
  }

  return (
    <>
      <MarkedTypography marked="center" variant={breakpoint ? 'h4' : 'h2'} className={classes.title}>
        {body.title}
      </MarkedTypography>
      <Typography className={subtitleStyles}>
        {body.subtitle}
      </Typography>
      <Typography className={classes.caption}>
        {body.caption}
      </Typography>
    </>
  )
}

function createPosterCards(classes, cards) {
  const filteredCards = Object.values(cards).filter(card => typeof card !== 'string');

  return (
    <Grid className={classes.posterCards} container spacing={2}>
      <Grid item xs={false} md={1}/>
      {filteredCards.map((card, i) => {
        return (
          <Grid item xs={12} md={5} key={i}>
            <Card>
              <CardContent>
                <Typography className={classes.cardTitle}>{card.subtitle}</Typography>
                <span className={classes.bullet}>•</span>
                <Typography className={classes.cardCaption}>{card.caption}</Typography>
              </CardContent>
            </Card>
          </Grid>
      )})}
      <Grid item xs={false} md={1}/>
    </Grid>
  )
}
