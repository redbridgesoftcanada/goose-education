import React from 'react';
import { Avatar, CircularProgress, Grid, Typography } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import PersonIcon from '@material-ui/icons/Person';
import Title from './Title';
import parse from 'html-react-parser';

export default function PreviewTemplate(props) {
  const { messages, total } = props;

  return (
    <>
      <Title>Recent Messages</Title>
      {messages.length ? 
        messages.map((message, i) => {
          return (
          <Grid container key={i}>
            <Grid item xs={3} md={3} lg={3}>
              <Avatar style={{backgroundColor: pink[500]}}><PersonIcon/></Avatar>
            </Grid>
            <Grid item xs={9} md={9} lg={9}>
              <Typography variant="subtitle2" align="left">{message.authorDisplayName}</Typography>
              <Typography color="textSecondary" variant="caption" align="left" noWrap>{parse(message.description)}</Typography>
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