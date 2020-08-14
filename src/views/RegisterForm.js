import React, { useState, createRef } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Box, Button, Collapse, Container, FormGroup, List, ListItem, ListItemIcon, ListItemText, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { ChevronRightOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { convertToTitleCase } from '../constants/helpers/_features';
import ErrorSnackbar from '../components/ErrorSnackbar';
import StyledValidators from '../components/customMUI';
import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";
import { useStyles } from '../styles/register';

const steps = ['Terms of Service', 'Account Setup', 'Personal Information', 'Notifications'];

function RegisterForm({ firebase }) {
  const classes = useStyles();
  const history = useHistory();

  // references for step-by-step form validation (onNextValidation);
  const accountFormRef = createRef();
  const personalFormRef = createRef();

  // separate state variables by form sections, active steps, and error management;
  const [ activeStep, setActiveStep ] = useState(0);
  
  const [ error, setError ] = useState({ exists: false, message: null });

  const [ termsOfService, setTermsOfService ] = useState({
    allTermsAgreed: false,
    collapseOpenTC: false,
    collapseOpenCP: false
  });
  const { allTermsAgreed, collapseOpenTC, collapseOpenCP } = termsOfService;

  const [ accountInfo, setAccountInfo ] = useState({
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: ''
  });
  const { username, email, passwordOne, passwordTwo } = accountInfo;

  const [ personalInfo, setPersonalInfo ] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    mobileNumber: '',
    address: ''
  });
  const { firstName, lastName, phoneNumber, mobileNumber } = personalInfo;

  const [ notifications, setNotifications ] = useState({
    receiveEmails: true,
    publicAccount: true
  });
  const { receiveEmails, publicAccount } = notifications;

  const handleUserInput = (type, e) => {
    const formField = e.target.name;
    let input = e.target.value;
    
    switch (type) {
      case 'termsOfService':
        input = e.target.checked;
        setTermsOfService(termsOfService => ({ ...termsOfService, [formField]: input }));
      
      case 'account':
        setAccountInfo(accountInfo => ({ ...accountInfo, [formField]: input }));

      case 'personal': 
        setPersonalInfo(personalInfo => ({ ...personalInfo, [formField]: input }));
      
      case 'notifications': 
        setNotifications(notifications => ({ ...notifications, [formField]: input }));
    }
  }

  const triggerCollapse = e => {
    if (e.currentTarget.id === 'termsAndConditions') {
      setTermsOfService(termsOfService => ({...termsOfService, collapseOpenTC: !termsOfService.collapseOpenTC}))
    }
    if (e.currentTarget.id === 'personalInfo') {
      setTermsOfService(termsOfService => ({...termsOfService, collapseOpenCP: !termsOfService.collapseOpenCP}))
    }
  }

  const onNextValidation = () => {
    switch (activeStep) {
      case 0:
        if (!allTermsAgreed) {
          setError({ 
            exists: true, 
            message: 'Please agree to the terms and conditions.' });
        } else if (allTermsAgreed) {
          setActiveStep(activeStep + 1);
        }
        break;
        
    case 1:
      if (accountFormRef.current) {
        accountFormRef.current.isFormValid(false).then(isValid => {
          if (passwordOne !== passwordTwo) {
            setError({
              exists: true, 
              message: 'Passwords do not match.' });
          } else if (passwordOne === passwordTwo && isValid){
            setActiveStep(activeStep + 1);
          }
        });
      }
      break;
    
    case 2: 
      if (personalFormRef.current) {
        personalFormRef.current.isFormValid(false).then(isValid => {
          if (isValid) {
            setActiveStep(activeStep + 1);
          }
        });
      }
      break;

      default:
        console.log('Missing activeStep case for Register Form.');
        setError({
          exists: true, 
          message: 'Sorry, it looks like something went wrong.' });
    }

  }

  const onSubmit = event => {
    firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser => {
      const user = authUser.user;
      const roles = { admin: false };

      return firebase.user(user.uid).set({
        username, email, firstName, lastName, phoneNumber, mobileNumber, receiveEmails, publicAccount, roles
      }, { merge: true });
    })
    .then(() => { history.push('/') })
    .catch(e => setError({ exists: true, message: e }));
    
    event.preventDefault();
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form className={classes.root} onSubmit={onSubmit}>
            <Typography className={classes.formTitle}>Please agree to the Terms of Service.</Typography>
            <Container>
              <FormGroup>
                <StyledValidators.CustomCheckbox
                  checked={allTermsAgreed}
                  name='allTermsAgreed'
                  onChange={e => handleUserInput('termsOfService', e)}
                  label='All Terms Agreed'
                  additionalText='This includes agreements to all required and optional terms. You may choose to agree or disagree to individual terms. You may still use the service even if you do not agree to the optional terms.'
                />

                <List>
                  <ListItem id='termsAndConditions' disableGutters button onClick={triggerCollapse}>
                    <ListItemIcon>
                      {collapseOpenTC ? <ExpandMoreOutlined/> : <ChevronRightOutlined/>}
                    </ListItemIcon>
                    <ListItemText>
                      Goose Terms and Conditions
                    </ListItemText>
                  </ListItem>

                  <Collapse in={collapseOpenTC} timeout="auto" unmountOnExit>
                    <List>
                      <ListItem>
                        <ListItemText>Hello</ListItemText>
                      </ListItem>
                    </List>
                  </Collapse>

                  <ListItem id='personalInfo' disableGutters button onClick={triggerCollapse}>
                    <ListItemIcon>
                      {collapseOpenCP ? <ExpandMoreOutlined/> : <ChevronRightOutlined/>}
                    </ListItemIcon>
                    <ListItemText>
                      Collection and Use of Personal Information
                    </ListItemText>
                  </ListItem>

                  <Collapse in={collapseOpenCP} timeout="auto" unmountOnExit>
                    <List>
                      <ListItem>
                        <ListItemText>Information</ListItemText>
                      </ListItem>
                    </List>
                  </Collapse>
                </List>
              </FormGroup>
            </Container>
          </form>
        );

      case 1: {
        return (
          <ValidatorForm ref={accountFormRef} className={classes.root} onSubmit={onSubmit}>
            {Object.keys(accountInfo).map(acctField => {
              const isEmail = acctField.includes('email');
              const isPassword = acctField.includes('password');
              const valRules = { validators: ['required'], errorMessages: [''] }
              const eValRules = { validators: ['required', 'isEmail'], errorMessages: ['', ''] }
              const pwValRules = { 
                validators: ['required', 'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'], 
                errorMessages: ['', 'Please choose a secure password (At least one lowercase, one uppercase, one numeric character, one special character. At least 8 characters long.)'] 
              }

              const inputType = isPassword ? 'password' : 'text';
              const validationRules = isEmail ? eValRules : isPassword ? pwValRules : valRules;

              const inputProps = {
                type: inputType,
                name: acctField,
                value: accountInfo[acctField],
                placeholder: convertToTitleCase(acctField),
                onChange: e => handleUserInput('account', e),
                ...validationRules
              }

              return <StyledValidators.TextField {...inputProps}/>
            })}
          </ValidatorForm>
        );
      }

      case 2:
        return (
          <ValidatorForm ref={personalFormRef} className={classes.root} onSubmit={onSubmit}>
            {Object.keys(personalInfo).map(perField => {
              const isPhoneNumber = perField.includes('Number');
              const valRules = { validators: ['required'], errorMessages: [''] }
              const phValRules = { validators: ['required', 'isNumber'], errorMessages: ['', ''] }

              const inputType = isPhoneNumber ? 'tel' : 'text';
              const validationRules = isPhoneNumber ? phValRules : valRules;

              const inputProps = {
                type: inputType,
                name: perField,
                value: personalInfo[perField],
                placeholder: convertToTitleCase(perField),
                onChange: e => handleUserInput('personal', e),
                ...validationRules
              }

              return <StyledValidators.TextField {...inputProps}/>
            })}
          </ValidatorForm>
        );

      case 3:
        return (
          <form className={classes.root} onSubmit={onSubmit}>
            <Container>
              <FormGroup>
                <StyledValidators.CustomCheckbox
                  name='receiveEmails'
                  value={receiveEmails}
                  onChange={e => handleUserInput('notification', e)}
                  label='Receive Emails'
                  additionalText='I would like to receieve email notifications.'
                />
                <StyledValidators.CustomCheckbox
                  name='publicAccount'
                  value={publicAccount}
                  onChange={e => handleUserInput('notification', e)}
                  label='Public Account'
                  additionalText='Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.'
                />
              </FormGroup>
          </Container>
        </form>
        );

      default:
        console.log('Unknown step index in Registration Form content.')
        return;
    }
  }

  return (
    <>
      {error.exists && 
        <ErrorSnackbar 
          isOpen={error.exists}
          onCloseHandler={() => setError({ exists: false, message: null })}
          ContentProps={{classes: {root: classes.snackBar}}}
          errorMessage={error.message}/>}

      <Typography className={classes.formTitle}>Create a New Account</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
      {getStepButtons(classes.stepButtons, activeStep, setActiveStep, onNextValidation)}
      <LoginLink/>
    </>
)}

const getStepButtons = (stepButtonsStyle, activeStep, setActiveStep, onNextValidation) => {
  return (
    <Box className={stepButtonsStyle}>
      <Button
        disabled={activeStep === 0}
        onClick={() => setActiveStep(activeStep - 1)}>
        Back
      </Button>
  
    {activeStep === steps.length - 1 ? 
      <Button 
        variant="contained"
        color="secondary"
        type="submit">
        Sign Up
      </Button>
      :
      <Button
        variant="contained" 
        color="secondary"
        onClick={() => onNextValidation()}>
        Next
      </Button>
    }
    </Box>
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