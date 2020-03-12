import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import TableTemplate from '../../components/material-ui/TableTemplate';

export default function Users(props) {
  const classes = props.classes;
  const listOfUsers = props.listOfUsers;

  return (
    <Container maxWidth="lg" className={classes.container}>
       <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <TableTemplate type='accounts' listOfResources={listOfUsers}/>
          </Paper>
        </Grid>
       </Grid>
    </Container>
  );
}