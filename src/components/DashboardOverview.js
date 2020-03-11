import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import Chart from './material-ui/Chart';
import Deposits from './material-ui/Deposits';
import Orders from './material-ui/Orders';

export default function DashboardOverview(props){
  const { classes, fixedHeightPaper } = props;
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}