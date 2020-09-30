import React from 'react';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import Title from './Title';
import parse from 'html-react-parser';

export default function PreviewTemplate(props) {
  const { title, data } = props;

  return (
    <>
      <Title>{title}</Title>
      {data.length ? 
        data.map((message, i) => {
          return (
          <Grid container key={i} wrap="nowrap">
            <Grid item zeroMinWidth>
              <Typography variant="subtitle2" align="left">{message.authorDisplayName}</Typography>
              <Typography variant="caption" align="left" color="textSecondary" >{parse(message.description)}</Typography>
            </Grid>
          </Grid>
        )})
      :
      <Grid container justify="center" alignItems="center">
        <CircularProgress color="secondary"/>
      </Grid>
      }
    </>
  );
}