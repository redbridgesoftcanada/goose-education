import React from 'react';
import { AuthUserContext, withAuthorization } from '../components/session';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => {

};

function UserProfile() {
  return (
    <AuthUserContext.Consumer>
      {authUser => 
        <>
          <Typography variant='h4'>Profile: {authUser.email}</Typography>
        </>
      }
    </AuthUserContext.Consumer>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserProfile);
// export default withStyles(styles)(UserProfile);