import React from 'react';
import { Box, Container, Typography } from "@material-ui/core";
import withRoot from './withRoot';
import { ResponsiveNavBars, ResponsiveFooters } from './views/appBars';

function Privacy(props) {
  return (
    <>
      <ResponsiveNavBars />
      <Container>
        <Box my={5}>
          <Typography variant='h6'>{props.title}</Typography>
          <br/>
          <Typography variant='body1' align='left'>{props.subtitle}</Typography>
          <br/>
          <Typography variant='body1' align='left'>{props.caption}</Typography>
        </Box>
      </Container>
      <ResponsiveFooters />
    </>
  );
}

export default withRoot(Privacy);