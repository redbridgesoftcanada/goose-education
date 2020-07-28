import React, { useState, createRef } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Box, Button, Collapse, Container, FormGroup, List, ListItem, ListItemIcon, ListItemText, Snackbar, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { ChevronRightOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { FormInputs } from '../components/customMUI';
import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";
import { useStyles } from '../styles/register';

const steps = ['Terms of Service', 'Account Setup', 'Personal Information', 'Notifications'];
const { customTextValidator, textValidator, checkboxField } = FormInputs;

function RegisterForm({ firebase }) {
  const classes = useStyles();
  const history = useHistory();

  const accountFormRef = createRef();
  const personalFormRef = createRef();

  const [ activeStep, setActiveStep ] = useState(0);

  const [ termsOfService, setTermsOfService ] = useState({
    allTermsAgreed: false,
    collapseOpenTC: false,
    collapseOpenCP: false
  });
  const { allTermsAgreed, collapseOpenTC, collapseOpenCP } = termsOfService;

  const [ accountInfo, setAccountInfo ] = useState({
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: ""
  });
  const { username, email, passwordOne, passwordTwo } = accountInfo;

  const [ personalInfo, setPersonalInfo ] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    mobileNumber: "",
    address: ""
  });
  const { firstName, lastName, phoneNumber, mobileNumber, address } = personalInfo;

  const [ notifications, setNotifications ] = useState({
    receiveEmails: true,
    publicAccount: true
  });
  const { receiveEmails, publicAccount } = notifications;

  const [ error, setError ] = useState({
    exists: false,
    message: null
  });

  const handleTermsOfServiceFields = event => {
    const formField = event.target.name;
    const userInput = event.target.checked;
    setTermsOfService(termsOfService => ({...termsOfService, [formField]: userInput }));
  }

  const handleAccountFields = event => {
    const field = event.target.name;
    const input = event.target.value;
    setAccountInfo(accountInfo => ({...accountInfo, [field]: input }))
  }

  const handlePersonalFields = event => {
    const field = event.target.name;
    const input = event.target.value;
    setPersonalInfo(personalInfo => ({...personalInfo, [field]: input }))
  }

  const handleNotifications = event => {
    const field = event.target.name;
    const input = event.target.value;
    setNotifications(notifications => ({...notifications, [field]: input }))
  }

  const triggerCollapse = event => {
    if (event.currentTarget.id === 'termsAndConditions') {
      setTermsOfService(termsOfService => ({...termsOfService, collapseOpenTC: !termsOfService.collapseOpenTC}))
    }
    if (event.currentTarget.id === 'personalInfo') {
      setTermsOfService(termsOfService => ({...termsOfService, collapseOpenCP: !termsOfService.collapseOpenCP}))
    }
  }

  const onNext = () => {
    switch (activeStep) {
      case 0:
        if (!allTermsAgreed) {
          setError({exists: true, message: "Please agree to the terms and conditions."});
        } else if (allTermsAgreed) {
          setActiveStep(activeStep + 1);
        }
        break;
        
    case 1:
      if (accountFormRef.current) {
        accountFormRef.current.isFormValid(false).then(isValid => {
          if (passwordOne !== passwordTwo) {
            setError({exists: true, message: "Passwords do not match."});
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
        const { allTermsAgreed, gooseTermsAndConditions, openTermsAndConditionsDialog, collectionPersonalInfo, gooseAlerts } = termsOfService;
        return (
          <form className={classes.root} onSubmit={onSubmit}>
            <Typography className={classes.formTitle}>Please agree to the Terms of Service.</Typography>
            <Container>
              <FormGroup>
                {checkboxField(allTermsAgreed, 'allTermsAgreed', 'Agree to All Terms', 'This includes agreements to all required and optional terms. You may choose to agree or disagree to individual terms. You may still use the service even if you do not agree to the optional terms.', handleTermsOfServiceFields)}
                <List>
                  <ListItem disableGutters button onClick={triggerCollapse} id='termsAndConditions'>
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
                </List>

                <Collapse in={collapseOpenCP} timeout="auto" unmountOnExit>
                  <List>
                    <ListItem>
                      <ListItemText>Information</ListItemText>
                    </ListItem>
                  </List>
                </Collapse>

              </FormGroup>
            </Container>
          </form>
        );

      case 1:
        const { username, email, passwordOne, passwordTwo } = accountInfo;
        return (
          <ValidatorForm ref={accountFormRef} className={classes.root} onSubmit={onSubmit}>
            <Box>
              {customTextValidator('username', username, handleAccountFields, {
                type: 'text',
                placeholder: 'Username', 
                validators:['required'], 
                errorMessages:['Cannot submit an empty username.']})}
            </Box>
            <Box>
              {customTextValidator('email', email, handleAccountFields, {
                type: 'email',
                placeholder: 'Email',
                validators:['required', 'isEmail'], 
                errorMessages:['Cannot submit an empty email.', 'Please submit a valid email address.']})}
            </Box>
            <Box>
              {customTextValidator('passwordOne', passwordOne, handleAccountFields, {
                type: 'password',
                placeholder: 'Password',
                validators:['required', 'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'], 
                errorMessages:['Cannot submit an empty password.', 'Please choose a secure password (At least one lowercase, one uppercase, one numeric character, one special character. At least 8 characters long.']})}
            </Box>
            <Box>
              {customTextValidator('passwordTwo', passwordTwo, handleAccountFields, {
                type: 'password',
                placeholder: 'Confirm password',
                validators:['required', 'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'], 
                errorMessages:['Cannot submit an empty password.', 'Please choose a secure password (At least one lowercase, one uppercase, one numeric character, one special character. At least 8 characters long.']})}
            </Box>
          </ValidatorForm>
        );

      case 2:
        const { firstName, lastName, phoneNumber, mobileNumber, address } = personalInfo;
        return (
          <ValidatorForm ref={personalFormRef} className={classes.root} onSubmit={onSubmit}>
            <Box>{textValidator('firstName', firstName, handlePersonalFields, {type: 'text', placeholder: 'First Name'})}</Box>
            <Box>{textValidator('lastName', lastName, handlePersonalFields, {type: 'text', placeholder: 'Last Name'})}</Box>
            <Box>{textValidator('phoneNumber', phoneNumber, handlePersonalFields, {type: 'tel', placeholder: 'Phone Number'})}</Box>
            <Box>{textValidator('mobileNumber', mobileNumber, handlePersonalFields, {type: 'tel', placeholder: 'Mobile Number'})}</Box>
            <Box>{textValidator('address', address, handlePersonalFields, {type: 'text', placeholder: 'Address'})}</Box>
          </ValidatorForm>
        );

      case 3:
        return (
          <form className={classes.root} onSubmit={onSubmit}>
            <Container>
              <FormGroup>
                {checkboxField(receiveEmails, 'receiveEmails', 'Receive Emails', 'I would like to receieve email notifications.', handleNotifications)}
                {checkboxField(publicAccount, 'publicAccount', 'Public Account', 'Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.', handleNotifications)}
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
        <Snackbar
          open={error.exists}
          autoHideDuration={2000}
          onClose={() => setError({ exists: false, message: null })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
          ContentProps={{classes: {root: classes.snackBar}}}
          message={<Typography className={classes.error}>{error.message}</Typography>}
        />
      }
      <Typography className={classes.formTitle}>Create a New Account</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
      {getStepButtons(classes.stepButtons, activeStep, setActiveStep, onNext)}
      <LoginLink/>
    </>
)}

const getStepButtons = (stepButtonsStyle, activeStep, setActiveStep, onNext) => {
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
        onClick={() => onNext()}>
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