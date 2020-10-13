import React from 'react';
import { Avatar, Box, Button, Typography } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import { withAuthorization } from '../components/session';
import useStyles from '../styles/profile';

function UserProfile(props) {
  const classes = useStyles();
  const { authUser, profile } = props;
  const { lastSignInTime, creationTime } = authUser.metadata;

  const options = { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  const formattedSignInTime = new Date(lastSignInTime).toLocaleDateString('en', options);
  const formattedCreationTime = new Date(creationTime).toLocaleDateString('en', options);

  return (
    <>
      <Box my={3} className={classes.avatarContainer}>
      <Avatar className={classes.avatar}>{profile.username.slice(0, 1)}</Avatar>
      </Box>
      <Typography variant='h4'>{profile.username}</Typography>
      <Box my={1}>
        <Typography variant='h6'>{profile.firstName} {profile.lastName}</Typography>
        <Typography variant='body1'>{profile.email}</Typography>
      </Box>
      <Box my={1} px={2}>
        <Typography variant='body2'>Last Logged In: {formattedSignInTime}</Typography>
        <Typography variant='body2'>Member Since: {formattedCreationTime}</Typography>
      </Box>

      <Button 
        variant='outlined'
        size='small'
        component={RouterLink}
        to='/profile/edit'>
        Edit
      </Button>
    </>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserProfile);