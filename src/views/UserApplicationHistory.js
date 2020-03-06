import React from 'react';
import { Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { format } from 'date-fns';
import { withAuthorization } from '../components/session';

// const styles = theme => {
// };

function UserApplicationHistory(props) {
  let application;
  if (props.application) {
    application = props.application;
  }

  return (
    <Container>
      <Typography variant='h5'>School Application History</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='center'>No</TableCell>
            <TableCell align='center'>Content</TableCell>
            <TableCell align='center'>Status</TableCell>
            <TableCell align='center'>Date</TableCell>
            <TableCell align='center'>Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {application ? 
          <TableRow>
            <TableCell align='center'>1</TableCell>
            <TableCell align='center'>{application.programName}, {application.schoolName}</TableCell>
            <TableCell align='center'>{application.status}</TableCell>
            <TableCell align='center'>{format(application.createdAt, 'Pp')}</TableCell>
            <TableCell align='center'>
              <IconButton size='small'>
                <GetAppIcon />
            </IconButton>
            </TableCell>
          </TableRow>
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