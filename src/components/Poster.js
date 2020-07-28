import React from 'react';
import { Typography, useTheme, useMediaQuery } from '@material-ui/core/';
import MarkedTypography from '../components/onePirate/Typography';
import PageBannerLayout from '../views/PageBannerLayout';
import useStyles from '../styles/constants';

export default function Poster(props) {
  const theme = useTheme();
  const classes = useStyles(props, 'poster');
  const { backgroundImage, body, layoutType } = props;

  const xsBreakpoint = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={classes.background}>
      <PageBannerLayout backgroundClassName={classes.background} layoutType={layoutType}>
        {/* Increase the network loading priority of the background image. */}
        <img style={{display:'none'}} src={backgroundImage} alt='header background banner'/>
        {generatePosterContent(body, classes, layoutType, xsBreakpoint)}
      </PageBannerLayout>
    </div>
  );
}

function generatePosterContent(body, classes, layoutType, breakpoint) {
  const customPosters = layoutType === 'vancouver_now' || layoutType === 'study_abroad';

  if (customPosters) {
    return (
      <>
        <Typography className={classes.subtitle}>
          {body.subtitle}
        </Typography>
        <MarkedTypography marked="center" variant={breakpoint ? 'h4' : 'h2'}>
          {body.title}
        </MarkedTypography>
        <Typography className={classes.caption}>
          {body.caption}
        </Typography>
        {body.other}
      </>
    )
  }

  return (
    <>
      <MarkedTypography marked="center" variant={breakpoint ? 'h4' : 'h2'} className={classes.title}>
        {body.title}
      </MarkedTypography>
      <Typography className={classes.subtitle}>
        {body.subtitle}
      </Typography>
      <Typography className={classes.caption}>
        {body.caption}
      </Typography>
    </>
  )
}