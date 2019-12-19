import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, TextField, Typography, makeStyles } from '@material-ui/core'

import { withFirebase } from '../components/firebase';
import { RegisterLink } from './RegisterForm';
import { PasswordForgetLink } from './ForgotPasswordForm';

const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
    error: {
      color: theme.palette.secondary.main
    },
}));

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const LoginFormBase = props => {
    const classes = useStyles();

    const [ state, setState ] = useState({...INITIAL_STATE});
    const { email, password, error } = state;
    const { firebase, history } = props;

    // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
    const isInvalid = password === '' || email === '';

    const onChange = event => setState({...state, [event.target.name]: event.target.value});

    const onSubmit = event => {
      firebase.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setState({...INITIAL_STATE});
        history.push('/');
      })
      .catch(error => setState({ error }));
      
      event.preventDefault();
    }

    return (
        <>
          <Typography variant='h4'>Login to Goose Education</Typography>
          <form className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
            <div> 
              <TextField
                variant="outlined"
                name="email"
                value={email}
                onChange={onChange}
                type="text"
                placeholder="Email Address"
                error={(error && error.code.includes("email")) ? true : false}
              />
              <TextField
                variant="outlined"
                name="password"
                value={password}
                onChange={onChange}
                type="password"
                placeholder="Password"
                error={(error && error.code.includes("argument")) ? true : false}
              />
              </div>
            {error && <Typography variant="body2" className={classes.error}>{error.message}</Typography>}
            <Button 
              variant="contained" 
              size="large" 
              disabled={isInvalid} 
              type="submit"
            >
              Login
            </Button>
          </form>
          <PasswordForgetLink/>
          <br/><br/>
          <RegisterLink/>
        </>
    )
}

const LoginLink = () => (
  <Typography variant="body">
    Have an account? <Link to="/login" >Login</Link>
  </Typography>
);

const LoginForm = withRouter(withFirebase(LoginFormBase));

export default LoginForm;
export { LoginLink };