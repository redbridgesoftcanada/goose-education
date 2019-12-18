import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../components/firebase';
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const INITIAL_STATE = {
  email: '',
  error: null,
};

const PasswordForgetFormBase = ({ firebase }) => {
  const classes = useStyles();
  const [ state, setState ] = useState({...INITIAL_STATE});
  const { email, error } = state;

  const isInvalid = email === '';

  const onChange = event => setState({ ...state, [event.target.name]: event.target.value });

  const onSubmit = event => {
      firebase.doPasswordReset(email)
      .then(() => setState({...INITIAL_STATE}))
      .catch(error => setState( error ));
  
      event.preventDefault();
  }

  return (
      <>
        <Typography variant="h4">Trouble Logging In?</Typography>
        <Typography variant="body1">Enter your email and we'll send you a link to get back into your account.</Typography>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            name="email"
            value={email}
            onChange={onChange}
            type="text"
            placeholder="Email Address"
          />
          <Button disabled={isInvalid} type="submit">Send Login Link</Button>
          {error && <Typography variant="subtitle1">{error.message}</Typography>}
        </form>
      </>
  )
}

const PasswordForgetLink = () => (
  <Typography variant="body">
    <Link to="/forgotpassword">Forgot Password?</Link>
  </Typography>
);

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default PasswordForgetForm;
export { PasswordForgetLink };