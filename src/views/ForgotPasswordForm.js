import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from "@material-ui/core";
import { ValidatorForm } from 'react-material-ui-form-validator';
import StyledValidators  from '../components/customMUI';
import ErrorSnackbar from '../components/ErrorSnackbar';
import { withFirebase } from '../components/firebase';
import { useStyles } from '../styles/forgotPassword';

function PasswordForgetForm({ firebase, form }) {
  const classes = useStyles();

  const [ email, setEmail ] = useState('');
  const [ notification, setNotification ] = useState(null);

  const onSubmit = event => {
    firebase.doPasswordReset(email);
    setNotification('Please check your email for instructions to reset your password.');
    event.preventDefault();
  }

  return (
    <>
      {notification && 
        <ErrorSnackbar 
        isOpen={!!notification}
        onCloseHandler={() => setNotification(null)}
        errorMessage={notification}/>}

      <Typography className={classes.formTitle}>{form.title}</Typography>
      <Typography className={classes.formSubtitle}>{form.subtitle}</Typography>
      <ValidatorForm className={classes.root} onSubmit={onSubmit}>
        <Box mx={2}>
          <StyledValidators.AuthLoginField
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={notification}
            validators={['required', 'isQuillEmpty', 'isEmail']}
            errorMessages={['', '', '']}
          />
        </Box>
        <Button
          variant="contained" 
          color="secondary"
          type="submit"
        >
          {form.caption}
        </Button>
      </ValidatorForm>
    </>
  )
}

const PasswordForgetLink = props => (
  <Typography 
    className={props.forgotLinkStyle} 
    component={Link} 
    to="/forgotpassword"
  >
    Forgot Password?
  </Typography>
);

export default withFirebase(PasswordForgetForm);
export { PasswordForgetLink };