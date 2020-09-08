import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withFirebase } from '../components/firebase';
import { RegisterLink } from './RegisterForm';
import { PasswordForgetLink } from './ForgotPasswordForm';
import StyledValidators  from '../components/customMUI';
import { useStyles } from '../styles/login';

function LoginForm(props) {
  const classes = useStyles(props);
  const { firebase, history, loginForm } = props;

  const [ loginCred, setLoginCred ] = useState({ email: '', password: '' });
  const [ error, setError ] = useState(null);
  const { email, password } = loginCred;

  const onChange = event => setLoginCred(({ ...loginCred, [event.target.name]: event.target.value}));

  const onSubmit = event => {
    firebase.doSignInWithEmailAndPassword(email, password)
    .then(authUser => {
      const user = authUser.user;
      const lastSignInTime = Number(user.metadata.b);
      return firebase.user(user.uid).set({lastSignInTime}, {merge: true});
    })
    .then(() => {
      setLoginCred({ email: '', password: '' });
      history.push('/');
    })
    .catch(error => 
      setError(error),
      setLoginCred({ email: '', password: '' })
    );
    
    event.preventDefault();
  }

  return (
    <>
      <Typography className={classes.formTitle}>{loginForm.title}</Typography>
      <ValidatorForm className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
        <Grid container spacing={2} className={classes.formFields}>
          <Grid item>
            <StyledValidators.AuthLoginField
              type='text'
              name='email'
              value={email}
              label='Email Address'
              onChange={onChange}
              error={error}/>
          </Grid>

          <Grid item>
            <StyledValidators.AuthLoginField
              type='password'
              name='password'
              value={password}
              label='Password'
              onChange={onChange}
              error={error}/>
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
      </ValidatorForm>
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