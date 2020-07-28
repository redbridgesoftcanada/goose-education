import React, { useReducer, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Divider, FormGroup, IconButton, Snackbar, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import { ValidatorForm } from "react-material-ui-form-validator";

import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";
import TermsofServiceDialog from "../components/TermsOfServiceDialog";
import { FormInputs } from '../components/customMUI';
import { useStyles } from '../styles/register';

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

// function toggleReducer(state, action) {
//   let type = action.type;
//   let { name, value } = type;

//   let payload = action.payload;

//   switch(type) {
//     case 'next': 
//     return {
//       ...state,
//       activeStep: state.activeStep + 1
//     }

//     case 'back': 
//     return {
//       ...state,
//       activeStep: state.activeStep - 1
//     }

//     case 'submit': 
//     return {
//       ...INITIAL_STATE
//     }

//     case 'error':
//       return {
//         isError: true,
//         error: payload
//       }
    
//     case 'allTermsAgreed':
//       return {
//         ...state,
//         allTermsAgreed: payload.checked,
//         gooseTermsAndConditions: payload.checked,
//         collectionPersonalInfo: payload.checked,
//         gooseAlerts: payload.checked,
//       }

//     case 'dialog': 
//       return {
//         ...state,
//         openTermsAndConditionsDialog: !state.openTermsAndConditionsDialog,
//       }

//     case 'notifications':
//     case 'termsOfService':
//       return {
//         ...state,
//         [payload.name]: payload.checked
//       }

//     default: 
//     return {
//       ...state,
//       [name]: value
//     }
//   }
// }

function RegisterForm({ firebase, history }) {
  const classes = useStyles();
  const { textValidator, checkboxField } = FormInputs;

  const [ activeStep, setActiveStep ] = useState(0);

  const [ termsOfService, setTermsOfService ] = useState({
    allTermsAgreed: false,
    gooseTermsAndConditions: false,
    openTermsAndConditionsDialog: false,
    collectionPersonalInfo: false,
    gooseAlerts: false
  });
  const handleTermsOfServiceFields = event => {
    setTermsOfService(termsOfService => ({...termsOfService, [event.target.name]: event.target.checked}))
  }

  const [ accountInfo, setAccountInfo ] = useState({
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: ""
  });
  const handleAccountFields = event => {
    setAccountInfo(accountInfo => ({...accountInfo, [event.target.name]: event.target.value}))
  }

  const [ personalInfo, setPersonalInfo ] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    mobileNumber: "",
    address: ""
  });
  const handlePersonalFields = event => {
    setPersonalInfo(personalInfo => ({...personalInfo, [event.target.name]: event.target.value}))
  }

  const [ notifications, setNotifications ] = useState({
    receiveEmails: true,
    receiveSMS: true,
    publicAccount: true
  });

  // const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  // const { activeStep, allTermsAgreed, gooseTermsAndConditions, openTermsAndConditionsDialog, collectionPersonalInfo, gooseAlerts, username, email, passwordOne, passwordTwo, firstName, lastName, phoneNumber, mobileNumber, address, receiveEmails, receiveSMS, publicAccount, isError, error } = state;

  // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
  // const isInvalid = passwordOne !== passwordTwo || passwordOne === "" || email === "" || username === "";

  // const isButtonDisabled = () => {
  //   switch (activeStep) {
  //     case 0:
  //       return !(allTermsAgreed || gooseTermsAndConditions && collectionPersonalInfo);

  //     case 1:
  //       return username === "" || email === "" || passwordOne === "" || passwordOne !== passwordTwo;

  //     case 2: 
  //       return firstName === "" || lastName === ""; 
      
  //     default:
  //   }
  // }
  
  const getStepButtons = () => {
    return (
      <>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
    
      {activeStep === steps.length - 1 ? 
      <Button 
        variant="contained"
        color="secondary"
        type="submit"
      >
        Sign Up
      </Button>
      :
      <Button
        variant="contained" 
        color="secondary" 
        onClick={() => setActiveStep(activeStep + 1)}
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
        const { allTermsAgreed, gooseTermsAndConditions, openTermsAndConditionsDialog, collectionPersonalInfo, gooseAlerts } = termsOfService;
        return (
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <Typography className={classes.formTitle}>Please agree to the Terms of Service.</Typography>
            <Container>
              <FormGroup>
                {checkboxField(allTermsAgreed, 'allTermsAgreed', 'Agree to All Terms', 'This includes agreements to all required and optional terms. You may choose to agree or disagree to inidual terms. You may still use the service even if you do not agree to the optional terms.', handleTermsOfServiceFields)}
                <Divider className={classes.divider}/>
                <div className={classes.gooseTermsAndConditions}>
                  {checkboxField(gooseTermsAndConditions, 'gooseTermsAndConditions', '[Required] Goose Terms and Conditions', '', handleTermsOfServiceFields)}
                  <IconButton onClick={() => setTermsOfService(termsOfService => ({...termsOfService, openTermsAndConditionsDialog: !termsOfService.openTermsAndConditionsDialog}))}>
                    <ChevronRightOutlinedIcon fontSize="small"/>
                  </IconButton>
                </div>
                <TermsofServiceDialog open={openTermsAndConditionsDialog} onClose={() => setTermsOfService(termsOfService => ({...termsOfService, openTermsAndConditionsDialog: !termsOfService.openTermsAndConditionsDialog}))} />
                {checkboxField(collectionPersonalInfo, 'collectionPersonalInfo', '[Required] Collection and Use of Personal Information', '', handleTermsOfServiceFields)}
                {checkboxField(gooseAlerts, 'gooseAlerts', '[Optional] Add Goose alerts and receive marketing messages.', '', handleTermsOfServiceFields)}
              </FormGroup>
            </Container>
            {getStepButtons()}
          </form>
        );

      case 1:
        const { username, email, passwordOne, passwordTwo } = accountInfo;
        return (
          <ValidatorForm className={classes.root} onSubmit={onSubmit}>
            {textValidator('username', username, 'Username', handleAccountFields)}
            {textValidator('email', email, 'Email Address', handleAccountFields)}
            {textValidator('passwordOne', passwordOne, 'Password', handleAccountFields)}
            {textValidator('passwordTwo', passwordTwo, 'Confirm Password', handleAccountFields)}
            {/* {error && <Typography className={classes.error}>{error.message}</Typography>} */}
            {getStepButtons()}
          </ValidatorForm>
        );

      case 2:
        const { firstName, lastName, phoneNumber, mobileNumber, address } = personalInfo;
        return (
          <ValidatorForm className={classes.root} onSubmit={onSubmit}>
            {textValidator('firstName', firstName, 'First Name', handlePersonalFields)}
            {textValidator('lastName', lastName, 'Last Name', handlePersonalFields)}
            {textValidator('phoneNumber', phoneNumber, 'Phone Number', handlePersonalFields)}
            {textValidator('mobileNumber', mobileNumber, 'Mobile Number', handlePersonalFields)}
            {textValidator('address', address, 'Address', handlePersonalFields)}
            {/* {error && <Typography className={classes.error}>{error.message}</Typography>} */}
            {getStepButtons()}
          </ValidatorForm>
        );

      case 3:
        return (
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <Container>
              <FormGroup>
{/*                 
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
                <FormHelperText>Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.</FormHelperText> */}
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
    firebase.doCreateUserWithEmailAndPassword(accountInfo.email, accountInfo.passwordOne)
    .then(authUser => {
      const user = authUser.user;
      const roles = { admin: false };

      return firebase.user(user.uid).set({
        // username, email, firstName, lastName, phoneNumber, mobileNumber, receiveEmails, receiveSMS, publicAccount, roles
      }, { merge: true });
    })
    .then(() => {
        // dispatch({ type: 'submit' });
        history.push('/');
      })
      // .catch(error => 
        // dispatch({ type: 'error', payload: error }));
    
      event.preventDefault();
  }

  return (
    <>
      {/* { isError && 
        <Snackbar
          open={isError}
          autoHideDuration={1000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
          message={<Typography className={classes.error}>{error}</Typography>}
        />
      } */}
      <Typography className={classes.formTitle}>Create a New Account</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
      <LoginLink/>
    </>
)}

const RegisterLink = props => (
  <Typography 
    className={props.registerLinkStyle}
    component={Link}
    to='/register'>
    Don't have an account? Sign Up
  </Typography>
);

export default withRouter(withFirebase(RegisterForm));
export { RegisterLink };