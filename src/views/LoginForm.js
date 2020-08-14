import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { withFirebase } from '../components/firebase';
import { RegisterLink } from './RegisterForm';
import { PasswordForgetLink } from './ForgotPasswordForm';
import StyledValidators  from '../components/customMUI';
import { useStyles } from '../styles/login';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

function LoginForm(props) {
  const classes = useStyles(props);
  const { firebaseValidator } = StyledValidators;
  const { firebase, history, loginForm } = props;

  const [ state, setState ] = useState({...INITIAL_STATE});
  const { email, password, error } = state;

  const onChange = event => setState({
    ...state,
    error: null,
    [event.target.name]: event.target.value});

  const onSubmit = event => {
    firebase.doSignInWithEmailAndPassword(email, password)
    .then(authUser => {
      const user = authUser.user;
      const lastSignInTime = Number(user.metadata.b);
      return firebase.user(user.uid).set({lastSignInTime}, {merge: true});
    })
    .then(() => {
      setState({...INITIAL_STATE});
      history.push('/');
    })
    .catch(error => setState({error}));
    
    event.preventDefault();
  }

  return (
    <>
      <Typography className={classes.formTitle}>{loginForm.title}</Typography>
      <form className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
        <Grid container spacing={2} className={classes.formFields}>
          <Grid item>
            {firebaseValidator('text', 'email', email, 'Email Address', onChange, error)}
          </Grid>

          <Grid item>
            {firebaseValidator('password', 'password', password, 'Password', onChange, error)}
          </Grid>
        </Grid>
        {error && <Typography className={classes.error}>{error.message}</Typography>}
        <Button
          className={classes.submitButton}
          variant="contained" 
          color="secondary"
          size="large" 
          type="submit"
        >
          {loginForm.caption}
        </Button>
      </form>
      <PasswordForgetLink forgotLinkStyle={classes.forgotLink}/>
      <br/><br/>
      <RegisterLink registerLinkStyle={classes.registerLink}/>
    </>
  )
}

const LoginLink = () => (
  <Typography 
    variant="body2"
    component={Link}
    to='/login'
  >
    Have an account? Login
  </Typography>
);

export default withRouter(withFirebase(LoginForm));
export { LoginLink };