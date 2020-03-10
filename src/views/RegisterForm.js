import React, { useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Checkbox, Container, Divider, FormControlLabel, FormHelperText, FormGroup, IconButton, Snackbar, Step, StepLabel, Stepper, TextField, Typography, makeStyles } from "@material-ui/core";
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';

import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";
import TermsofServiceDialog from "../components/TermsOfServiceDialog";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 300,
    },
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  gooseTermsAndConditions: {
    display: 'inline-flex'
  },
  error: {
    color: theme.palette.secondary.main
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const INITIAL_STATE = {
  activeStep: 0,
  allTermsAgreed: false,
  gooseTermsAndConditions: false,
  openTermsAndConditionsDialog: false,
  collectionPersonalInfo: false,
  gooseAlerts: false,
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
  receiveSMS: true,
  publicAccount: true,
  isError: false,
  error: null,
}

const steps = ['Terms of Service', 'Account Setup', 'Personal Information', 'Notifications'];

function toggleReducer(state, action) {
  let type = action.type;
  let { name, value } = type;

  let payload = action.payload;

  switch(type) {
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
    
    case 'allTermsAgreed':
      return {
        ...state,
        allTermsAgreed: payload.checked,
        gooseTermsAndConditions: payload.checked,
        collectionPersonalInfo: payload.checked,
        gooseAlerts: payload.checked,
      }

    case 'dialog': 
      return {
        ...state,
        openTermsAndConditionsDialog: !state.openTermsAndConditionsDialog,
      }

    case 'notifications':
    case 'termsOfService':
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
  const { activeStep, allTermsAgreed, gooseTermsAndConditions, openTermsAndConditionsDialog, collectionPersonalInfo, gooseAlerts, username, email, passwordOne, passwordTwo, firstName, lastName, phoneNumber, mobileNumber, address, receiveEmails, receiveSMS, publicAccount, isError, error } = state;
  const roles = {};

  // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
  // const isInvalid = passwordOne !== passwordTwo || passwordOne === "" || email === "" || username === "";

  const isButtonDisabled = () => {
    switch (activeStep) {
      case 0:
        return !(allTermsAgreed || gooseTermsAndConditions && collectionPersonalInfo);

      case 1:
        return username === "" || email === "" || passwordOne === "" || passwordOne !== passwordTwo;

      case 2: 
        return firstName === "" || lastName === ""; 
    }
  }
  
  const getStepButtons = () => {
    return (
      <>
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
        disabled={isButtonDisabled()} 
        type="submit"
      >
        Sign Up
      </Button>
      :
      <Button
        variant="contained" 
        color="primary" 
        disabled={isButtonDisabled()}
        onClick={() => dispatch({ type: 'next' })}
      >
        Next
      </Button>
      }
    </>
  )
}

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <Typography variant="h6">Please agree to the Terms of Service.</Typography>
            <Container>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={allTermsAgreed} name="allTermsAgreed" onChange={(event) => dispatch({ type: 'allTermsAgreed', payload: event.target })} />}
                  label="Agree to All Terms"
                />
                <FormHelperText>This includes agreements to all required and optional terms. You may choose to agree or disagree to inidual terms. You may still use the service even if you do not agree to the optional terms.</FormHelperText>
                <Divider className={classes.divider}/>
                <div className={classes.gooseTermsAndConditions}>
                  <FormControlLabel
                    control={<Checkbox required checked={gooseTermsAndConditions} name="gooseTermsAndConditions" onChange={(event) => dispatch({ type: 'termsOfService', payload: event.target })} />}
                    label="[Required] Goose Terms and Conditions"
                  />
                  <IconButton onClick={(event) => dispatch({ type: 'dialog', payload: event.target })}>
                    <ChevronRightOutlinedIcon fontSize="small"/>
                  </IconButton>
                </div>
                <TermsofServiceDialog open={openTermsAndConditionsDialog} onClose={(event) => dispatch({ type: 'dialog', payload: event.target })} />
                <FormControlLabel
                  control={<Checkbox required checked={collectionPersonalInfo} name="collectionPersonalInfo" onChange={(event) => dispatch({ type: 'termsOfService', payload: event.target })} />}
                  label="[Required] Collection and Use of Personal Information"
                />
                <FormControlLabel
                  control={<Checkbox checked={gooseAlerts} name="gooseAlerts" onChange={(event) => dispatch({ type: 'termsOfService', payload: event.target })} />}
                  label="[Optional] Add Goose alerts and receive marketing messages."
                />
              </FormGroup>
            </Container>
            { getStepButtons() }
          </form>
        );

      case 1:
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
            { getStepButtons() }
          </form>
        );

      case 2:
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
                type="number"
                placeholder="Mobile Number"
              />
            </div>
            <div>
              <TextField
                disabled
                color="secondary"
                variant="outlined"
                name="address"
                value={address}
                onChange={(event) => dispatch({ type: event.target })}
                type="text"
                placeholder="Address"
              />
            </div>
            {error && <Typography variant="body2" className={classes.error}>{error.message}</Typography>}
            { getStepButtons() }
          </form>
        );

      case 3:
        return (
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <Container>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={receiveEmails} name="receiveEmails" onChange={(event) => dispatch({ type: 'notifications', payload: event.target })} />}
                  label="Receive Emails"
                />
                <FormHelperText>I would like to receieve email notifications.</FormHelperText>
                <FormControlLabel
                  control={<Checkbox checked={receiveSMS} name="receieveSMS" onChange={(event) => dispatch({ type: 'notifications', payload: event.target })} />}
                  label="Receive SMS"
                />
                <FormHelperText>I would like to receieve SMS notifications. Additional charges may apply from your service provider.</FormHelperText>
                <FormControlLabel
                  control={<Checkbox checked={publicAccount} name="publicAccount" onChange={(event) => dispatch({ type: 'notifications', payload: event.target })} />}
                  label="Public Account"
                />
                <FormHelperText>Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.</FormHelperText>
              </FormGroup>
          </Container>
          { getStepButtons() }
        </form>
        );

      default:
        return 'Unknown step index';
    }
  }

  const onSubmit = event => {
    firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser => {
      const user = authUser.user;

      return firebase.user(user.uid).set({
        username, email, firstName, lastName, phoneNumber, mobileNumber, receiveEmails, receiveSMS, publicAccount, roles
      }, { merge: true });
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
      { getStepContent(activeStep) }
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