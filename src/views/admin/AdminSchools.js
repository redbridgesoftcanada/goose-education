import React from 'react';
import { Container, Grid } from '@material-ui/core';
import TableTemplate from '../../components/material-ui/TableTemplate';

export default function Schools(props) {
  const classes = props.classes;
  const listOfSchools = props.listOfSchools;

  return (
    <Container maxWidth="lg" className={classes.container}>
       <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableTemplate type='schools' listOfResources={listOfSchools}/>
        </Grid>
       </Grid>
    </Container>
  );
}