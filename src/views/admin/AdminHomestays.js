import React from 'react';
import { Container, Grid } from '@material-ui/core';
import TableTemplate from '../../components/material-ui/TableTemplate';

export default function Homestays(props) {
  const classes = props.classes;
  const listOfHomestays = props.listOfHomestays;

  return (
    <Container maxWidth="lg" className={classes.container}>
       <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableTemplate type='homestays' listOfResources={listOfHomestays}/>
        </Grid>
       </Grid>
    </Container>
  );
}