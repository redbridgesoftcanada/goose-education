import React, { useState, useEffect } from 'react';
import { withAuthorization } from '../components/session';
import { CircularProgress, Typography } from '@material-ui/core';

// const styles = theme => {

// };

const INITIAL_STATE = {
  isLoading: true,
  user: {}
}

function UserProfile({ authUser, firebase }) {
  const [ state, setState ] = useState({...INITIAL_STATE});
  const { isLoading, user } = state;

  // useEffect(() => {
  //   async function findUserById() {
  //     const response = await firebase.user(authUser.uid).get();
  //     try {
  //       let user = response.data();
  //       setState({
  //         loading: false,
  //         user
  //       });
  //     }
  //     catch (err) {
  //       console.log('Error getting document', err);
  //     }
  //   }

  //   findUserById();
  // }, [user]);

  return (
    <>
      { isLoading && <CircularProgress /> }
      <Typography variant='h4'>Profile: {user.username}</Typography>
      <Typography variant='h4'>Email: {user.email}</Typography>
    </>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserProfile);
// export default withStyles(styles)(UserProfile);