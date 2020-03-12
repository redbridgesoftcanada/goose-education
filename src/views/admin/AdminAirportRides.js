import React from 'react';
import { Container, Grid } from '@material-ui/core';
import TableTemplate from '../../components/material-ui/TableTemplate';

export default function AirportRides(props) {
  const classes = props.classes;
  const listOfAirportRides = props.listOfAirportRides;

  return (
    <Container maxWidth="lg" className={classes.container}>
       <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableTemplate type='airportRides' listOfResources={listOfAirportRides}/>
        </Grid>
       </Grid>
    </Container>
  );
}