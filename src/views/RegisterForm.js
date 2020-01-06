import React, { useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Checkbox, Container, FormControlLabel, FormHelperText, FormGroup, Snackbar, Step, StepLabel, Stepper, TextField, Typography, makeStyles } from "@material-ui/core";

import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 300,
    },
  },
  error: {
    color: theme.palette.secondary.main
  },
}));

const INITIAL_STATE = {
  activeStep: 0,
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  mobileNumber: "",
  address: "",
  receiveEmails: true,
  receieveSMS: true,
  setAccountPublic: true,
  isError: false,
  error: null,
}

const steps = ['Account Setup', 'Personal Information', 'Notifications'];

function toggleReducer(state, action) {
  let type = action.type;
  let { name, value } = type;

  let payload = action.payload;

  switch(type) {
    case 'reset': 
    return {
      ...state,
      activeStep: 0
    }

    case 'next': 
    return {
      ...state,
      activeStep: state.activeStep + 1
    }

    case 'back': 
    return {
      ...state,
      activeStep: state.activeStep - 1
    }

    case 'submit': 
    return {
      ...INITIAL_STATE
    }

    case 'error':
      return {
        isError: true,
        error: payload
      }
    
    case 'checkbox':
      return {
        ...state,
        [payload.name]: payload.checked
      }
    default: 
    return {
      ...state,
      [name]: value
    }
  }
}

function RegisterFormBase({ firebase, history }) {
  const classes = useStyles();

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { activeStep, username, email, passwordOne, passwordTwo, firstName, lastName, phoneNumber, mobileNumber, receiveEmails, receieveSMS, setAccountPublic, isError, error } = state;
  const roles = {};

  // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
  const isInvalid = passwordOne !== passwordTwo || passwordOne === "" || email === "" || username === "";
  
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <TextField
              color="secondary"
              variant="outlined"
              name="username"
              value={username}
              onChange={(event) => dispatch({ type: event.target })}
              type="text"
              placeholder="Username"
            />
            <div>
            <TextField
                color="secondary"
                variant="outlined"
                name="email"
                value={email}
                onChange={(event) => dispatch({ type: event.target })}
                type="text"
                placeholder="Email Address"
                // error={(error && error.code.includes("email")) ? true : false}
              />
            </div>
            <div>
              <TextField
                color="secondary"
                variant="outlined"
                name="passwordOne"
                value={passwordOne}
                onChange={(event) => dispatch({ type: event.target })}
                type="password"
                placeholder="Password"
              />
              <TextField
                color="secondary"
                variant="outlined"
                name="passwordTwo"
                value={passwordTwo}
                onChange={(event) => dispatch({ type: event.target })}
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            {error && <Typography variant="body2" className={classes.error}>{error.message}</Typography>}
          </form>
        );
      case 1:
        return (
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <TextField
              color="secondary"
              variant="outlined"
              name="firstName"
              value={firstName}
              onChange={(event) => dispatch({ type: event.target })}
              type="text"
              placeholder="First Name"
            />
            <div>
            <TextField
                color="secondary"
                variant="outlined"
                name="lastName"
                value={lastName}
                onChange={(event) => dispatch({ type: event.target })}
                type="text"
                placeholder="Last Name"
              />
            </div>
            <div>
              <TextField
                color="secondary"
                variant="outlined"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(event) => dispatch({ type: event.target })}
                type="number"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <TextField
                color="secondary"
                variant="outlined"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(event) => dispatch({ type: event.target })}
                type="password"
                placeholder="Mobile Number"
              />
            </div>
            {error && <Typography variant="body2" className={classes.error}>{error.message}</Typography>}
          </form>
        );
      case 2:
        return (
          <Container>
            <div>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={receiveEmails} name="receiveEmails" onChange={(event) => dispatch({ type: 'checkbox', payload: event.target })} />}
                  label="Receive Emails"
                />
                <FormHelperText>I would like to receieve email notifications.</FormHelperText>
                <FormControlLabel
                  control={<Checkbox checked={receieveSMS} name="receieveSMS" onChange={(event) => dispatch({ type: 'checkbox', payload: event.target })} />}
                  label="Receive SMS"
                />
                <FormHelperText>I would like to receieve SMS notifications. Additional charges may apply from your service provider.</FormHelperText>
                <FormControlLabel
                  control={<Checkbox checked={setAccountPublic} name="setAccountPublic" onChange={(event) => dispatch({ type: 'checkbox', payload: event.target })} />}
                  label="Public Account"
                />
                <FormHelperText>Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.</FormHelperText>
              </FormGroup>
            </div>
        </Container>
        );
      default:
        return 'Unknown step index';
    }
  }

  const onSubmit = event => {
    firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser => {
      return firebase.user(authUser.user.uid).set({
        username, email, roles
      }, { merge: true })
    })  
    .then(() => {
        dispatch({ type: 'submit' });
        history.push('/');
      })
      .catch(error => 
        dispatch({ type: 'error', payload: error }));
    
      event.preventDefault();
  }

  return (
    <>
      { isError && 
        <Snackbar
          open={isError}
          autoHideDuration={1000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
          message={<Typography variant='subtitle2'>{error}</Typography>}
        />
      }
      <Typography variant="h4">Create a New Account</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
      {activeStep === steps.length ? (
          <>
            <Typography>All steps completed</Typography>
            <Button onClick={() => dispatch({ type: 'reset' })}>Reset</Button>
          </>
        ) : (
          <>
            { getStepContent(activeStep) }
              <Button
                disabled={activeStep === 0}
                onClick={() => dispatch({ type: 'back' })}
              >
                Back
              </Button>
            
            { activeStep === steps.length - 1 ? 
              <Button 
                variant="contained"
                color="primary"
                disabled={isInvalid} 
                type="submit"
              >
                Sign Up
              </Button>
            :
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => dispatch({ type: 'next' })}
            >
              Next
            </Button>
            }
          </>
        )}
      </>
      <LoginLink/>
    </>
)}

const RegisterLink = () => (
  <Typography variant="body2">
    Don't have an account? <Link to="/register" >Sign Up</Link>
  </Typography>
);

const RegisterForm = withRouter(withFirebase(RegisterFormBase));

export default RegisterForm;
export { RegisterLink };