import React from 'react';
import { Container, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { withAuthorization } from '../components/session';
import { STATUSES } from '../constants/constants';


// const styles = theme => {
// };

function UserApplicationHistory(props) {
  const { applications } = props;

  return (
    <Container>
      <Typography variant='h5'>School Application History</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Program</TableCell>
            <TableCell align='center'>School</TableCell>
            <TableCell align='center'>Date</TableCell>
            <TableCell align='center'>Status</TableCell>
            <TableCell align='center'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications && applications.length ? 
            applications.map(application => {
              return (
                <TableRow key={application.id}>
                  <TableCell align='center'>{application.programName} ({application.programDuration} weeks)</TableCell>
                  <TableCell align='center'>{application.schoolName}</TableCell>
                  <TableCell align='center'>{format(application.createdAt, 'P')}</TableCell>
                  <TableCell align='center'>{application.status}</TableCell>
                  <TableCell align='center'>
                    {(application.status !== STATUSES[2]) && "No changes can be made at this time."}
                    {(application.status === STATUSES[2]) && <Button color="secondary" size="small">Pay Tuition</Button>}
                  </TableCell>
                </TableRow>
              )
            })
          : 
          <TableRow>
            <TableCell/>
            <TableCell/>
            <TableCell align='center'>You have no submitted applications.</TableCell>
            <TableCell/>
            <TableCell/>
          </TableRow>
          }
        </TableBody>
      </Table>
    </Container>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserApplicationHistory);
// export default withStyles(styles)(UserProfile);