import React from 'react';
import { Avatar, CircularProgress, Grid, Typography } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import PersonIcon from '@material-ui/icons/Person';
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
            <Grid item xs={4} md={2} lg={2}>
              <Avatar style={{backgroundColor: pink[500]}}><PersonIcon/></Avatar>
            </Grid>
            <Grid item xs={8} md={10} lg={10} zeroMinWidth>
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