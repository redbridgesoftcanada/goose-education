import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, TextField, Typography, makeStyles } from '@material-ui/core'

import { withFirebase } from '../components/firebase';
import { RegisterLink } from './RegisterForm';

const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
      },
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
        setState({ ...INITIAL_STATE });
        history.push('/');
      })
      .catch(error => setState({ error }));
      
      event.preventDefault();
    }

    return (
        <>
          <Typography variant='h1'>Sign In</Typography>
          <form className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
              {error && <p>{error.message}</p>}
              <TextField
              name="email"
              value={email}
              onChange={onChange}
              type="text"
              placeholder="Email Address"
              />
              <TextField
              name="password"
              value={password}
              onChange={onChange}
              type="password"
              placeholder="Password"
              />
              <Button variant="outlined" disabled={isInvalid} type="submit">Login</Button>
          </form>
          <RegisterLink/>
        </>
    )
}

const LoginForm = withRouter(withFirebase(LoginFormBase));

export default LoginForm;