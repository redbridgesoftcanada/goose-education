import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";

import { withFirebase } from "../components/firebase";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
}

const RegisterFormBase = props => {
  const classes = useStyles();
  
  const [ state, setState ] = useState({...INITIAL_STATE});
  const { username, email, passwordOne, passwordTwo, error } = state;
  const { firebase, history } = props;

  // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
  const isInvalid = passwordOne !== passwordTwo || passwordOne === "" || email === "" || username === "";
  
  const onChange = event => setState({...state, [event.target.name]: event.target.value});
  
  const onSubmit = event => {
    firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        setState({ ...INITIAL_STATE });
        history.push('/');
      })
      .catch(error => setState({ error }));
    
      event.preventDefault();
  }

  return (
    <>
      <Typography variant="h1">Sign Up</Typography>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
        {error && <Typography variant="subtitle1">{error.message}</Typography>}
        <TextField
          name="username"
          value={username}
          onChange={onChange}
          type="text"
          placeholder="Full Name"
        />
        <TextField
          name="email"
          value={email}
          onChange={onChange}
          type="text"
          placeholder="Email Address"
        />
        <TextField
          name="passwordOne"
          value={passwordOne}
          onChange={onChange}
          type="password"
          placeholder="Password"
        />
        <TextField
          name="passwordTwo"
          value={passwordTwo}
          onChange={onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <Button variant="outlined" disabled={isInvalid} type="submit">Sign Up</Button>
      </form>
    </>
)}

const RegisterLink = () => (
  <Typography variant="subtitle2">
    Don't have an account? <Link to="/register" >Sign Up</Link>
  </Typography>
);

const RegisterForm = withRouter(withFirebase(RegisterFormBase));

export default RegisterForm;
export { RegisterLink };