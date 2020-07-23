import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from "@material-ui/core";
import { FormInputs }  from '../components/customMUI';
import { withFirebase } from '../components/firebase';
import { useStyles } from '../styles/forgotPassword';

const INITIAL_STATE = {
  email: '',
  error: null,
};

function PasswordForgetForm({ firebase, form }) {
  const classes = useStyles();
  const { firebaseValidator } = FormInputs;

  const [ state, setState ] = useState({...INITIAL_STATE});
  const { email, error } = state;

  const onChange = event => setState({
    ...state,
    error: null,
    [event.target.name]: event.target.value});

  const onSubmit = event => {
    firebase.doPasswordReset(email)
    .then(() => setState({...INITIAL_STATE}))
    .catch(error => setState( error ));

    event.preventDefault();
  }

  return (
    <>
      <Typography className={classes.formTitle}>{form.title}</Typography>
      <Typography className={classes.formSubtitle}>{form.subtitle}</Typography>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
        <Box className={classes.formField}>
          {firebaseValidator('text', 'email', email, 'Email', onChange, error)}
        </Box>
        {error && <Typography className={classes.error}>{error.message}</Typography>}
        <Button
          variant="contained" 
          color="secondary"
          size="large" 
          type="submit"
        >
          {form.caption}
        </Button>
      </form>
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