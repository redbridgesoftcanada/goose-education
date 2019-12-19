import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";

import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  error: {
    color: theme.palette.secondary.main
  },
}));

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
}

const RegisterFormBase = ({ firebase, history }) => {
  const classes = useStyles();
  
  const [ state, setState ] = useState({...INITIAL_STATE});
  const { username, email, passwordOne, passwordTwo, error } = state;

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
      <Typography variant="h4">Sign Up</Typography>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
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
            name="passwordOne"
            value={passwordOne}
            onChange={onChange}
            type="password"
            placeholder="Password"
            />
          <TextField
            variant="outlined"
            name="passwordTwo"
            value={passwordTwo}
            onChange={onChange}
            type="password"
            placeholder="Confirm Password"
            />
        </div>
        {error && <Typography variant="body2" className={classes.error}>{error.message}</Typography>}
        <Button 
          variant="contained" 
          size="large"
          disabled={isInvalid} 
          type="submit"
          >
          Sign Up
        </Button>
      </form>
      <LoginLink/>
    </>
)}

const RegisterLink = () => (
  <Typography variant="body">
    Don't have an account? <Link to="/register" >Sign Up</Link>
  </Typography>
);

const RegisterForm = withRouter(withFirebase(RegisterFormBase));

export default RegisterForm;
export { RegisterLink };