import React from 'react';
import { Container, Grid } from '@material-ui/core';
import TableTemplate from '../../components/material-ui/TableTemplate';

export default function Applications(props) {
  const classes = props.classes;
  const listOfApplications = props.listOfApplications;

  return (
    <Container maxWidth="lg" className={classes.container}>
       <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableTemplate type='applications' listOfResources={listOfApplications}/>
        </Grid>
       </Grid>
    </Container>
  );
}