import React from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { withAuthorization } from '../components/session';
import EditProfile from '../components/navlinks/_editProfile';

// const styles = theme => {
// };

function UserProfile(props) {
  let user;
  if (props.profile) {
    user = props.profile;
  }
  const authUser = props.authUser;
  const { lastSignInTime, creationTime } = authUser.metadata;
  const options = { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  const formattedSignInTime = new Date(lastSignInTime).toLocaleDateString('en', options);
  const formattedCreationTime = new Date(creationTime).toLocaleDateString('en', options);

  return (
    <>
      <Typography variant='h4'>My Page</Typography>
      <EditProfile/>
      <br/>
      <Container>
        <Typography variant='h5'>My Info</Typography>
        <Table>
          <TableHead></TableHead>
          <TableBody>

            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="right">{user && user.email}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Last Logged In</TableCell>
              <TableCell align="right">{formattedSignInTime}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Member Since</TableCell>
              <TableCell align="right">{formattedCreationTime}</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </Container>
    </>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserProfile);
// export default withStyles(styles)(UserProfile);