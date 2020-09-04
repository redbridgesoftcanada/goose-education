import React, { useState, useEffect, createRef } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Box, Button, Collapse, Container, FormGroup, List, ListItem, ListItemIcon, ListItemText, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { ChevronRightOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { REGISTER_FORMS } from '../constants/constants';
import { convertToSentenceCase } from '../constants/helpers/_features';
import Snackbar from '../components/ErrorSnackbar';
import StyledValidators from '../components/customMUI';
import { withFirebase } from "../components/firebase";
import { LoginLink } from "./LoginForm";
import { useStyles } from '../styles/register';

function RegisterForm(props) {
  const { firebase } = props;
  const classes = useStyles();
  const history = useHistory();

  // references for step-by-step form validation (onNextValidation);
  const termsOfServiceFormRef = createRef();
  const accountFormRef = createRef();
  const personalFormRef = createRef();

  // separate state variables by form sections, active steps, and error management;
  const [ activeStep, setActiveStep ] = useState(0);
  
  const [ notification, setNotification ] = useState(null);

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
  const { firstName, lastName, phoneNumber, mobileNumber, address } = personalInfo;

  const handleUserInput = (type, e) => {
    const formField = e.target.name;
    let input = e.target.value;
    
    switch (type) {
      case 'termsOfService':
        input = e.target.checked;
        setTermsOfService(termsOfService => ({ ...termsOfService, [formField]: input }));
        break;
      
      case 'account':
        setAccountInfo(accountInfo => ({ ...accountInfo, [formField]: input }));
        break;

      case 'personal': 
        setPersonalInfo(personalInfo => ({ ...personalInfo, [formField]: input }));
        break;
      
      default:
        console.log(`Missing corresponding type ${type} for handleUserInput in Register Form.`);
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
        if (termsOfServiceFormRef.current) {
          termsOfServiceFormRef.current.isFormValid(false).then(isValid => {
            isValid && setActiveStep(activeStep + 1);
          });
        }
        break;
        
    case 1:
      if (accountFormRef.current) {
        accountFormRef.current.isFormValid(false).then(isValid => {
          isValid && setActiveStep(activeStep + 1);
        });
      }
      break;
    
    case 2: 
      if (personalFormRef.current) {
        personalFormRef.current.isFormValid(false).then(isValid => {
          isValid && setActiveStep(activeStep + 1);
        });
      }
      break;

      default:
        console.log('Missing activeStep case for Register Form.');
        setNotification('Sorry, it looks like something went wrong.');
    }

  }

  const onSubmit = async event => {
    const roles = { admin: false }

    try {
      const userAccount = await firebase.createAccountWithEmailAndPassword(email, passwordOne);
      
      await firebase.user(userAccount.user.uid).set({
        username, email, firstName, lastName, phoneNumber, mobileNumber, roles
      }, { merge: true });
  
      history.push('/');

    } catch(err) {
      console.log(err.code, err.message);
      // setNotification(err.message)
    }
    
    event.preventDefault();
  }

  const createRegisterForm = step => {
    switch (step) {
      case 0:
        return (
          <ValidatorForm ref={termsOfServiceFormRef} className={classes.root} onSubmit={onSubmit}>
            <Container>
              <StyledValidators.CustomCheckbox
                checked={allTermsAgreed}
                value={allTermsAgreed}
                name='allTermsAgreed'
                onChange={e => handleUserInput('termsOfService', e)}
                label='All Terms Agreed'
                additionalText='This includes agreements to all required and optional terms. You may choose to agree or disagree to individual terms. You may still use the service even if you do not agree to the optional terms.'
                validators={['isChecked']}
                errorMessages={['']}
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
                      <ListItemText></ListItemText>
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
                      <ListItemText></ListItemText>
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Container>
            {getStepButtons(classes.stepButtons, activeStep, setActiveStep, onNextValidation)}
          </ValidatorForm>
        );

      case 1: {
        return (
          <ValidatorForm ref={accountFormRef} className={classes.root} onSubmit={onSubmit}>
            {createAccountForm(accountInfo, handleUserInput)}
            {getStepButtons(classes.stepButtons, activeStep, setActiveStep, onNextValidation)}
          </ValidatorForm>
        );
      }

      case 2:
        return (
          <ValidatorForm ref={personalFormRef} className={classes.root} onSubmit={onSubmit}>
            {createPersonalForm(personalInfo, handleUserInput)}
            {getStepButtons(classes.stepButtons, activeStep, setActiveStep, onNextValidation)}
          </ValidatorForm>
        );

      default:
        console.log('Unknown step index in Registration Form content.')
        return;
    }
  }

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', value => {
      return value !== passwordOne ? false : true
    });

    ValidatorForm.addValidationRule('isChecked', value => !!value);

    // (optional cleanup mechanism for effects) - remove rule when not needed;
    return () => ValidatorForm.removeValidationRule('isPasswordMatch');
  });

  return (
    <>
      {notification && 
        <Snackbar 
          isOpen={!!notification}
          onCloseHandler={() => setNotification(null)}
          errorMessage={notification}/>
      }

      <Typography className={classes.formTitle}>Create a New Account</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {REGISTER_FORMS.map(label => (
          <Step key={label}>
            <StepLabel StepIconProps={{classes: {active: classes.stepActive, completed: classes.stepCompleted} }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {createRegisterForm(activeStep)}
      
      <LoginLink/>
    </>
)}

const createAccountForm = (accountState, changeHandler) => {
  return Object.keys(accountState).map((formField, i) => {
    // config props and validations for <StyledValidators.TextField/> component;
    let customProps = {};
    if (formField === 'passwordOne') {
      customProps = {
        type: 'password',
        placeholder: 'Password',
        validators: ['required', 'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'],
        errorMessages: ['', 'Please choose a secure password (At least one lowercase, one uppercase, one numeric character. At least 8 characters long.)']
      }

    } else if (formField === 'passwordTwo') {
      customProps = {
        type: 'password',
        placeholder: 'Confirm Password',
        validators: ['required', 'isPasswordMatch'],
        errorMessages: ['', '']
      }

    } else {
      customProps = {
        type: 'text',
        placeholder: convertToSentenceCase(formField),
        validators: (formField === 'email') ? ['required', 'isEmail'] : ['required'],
        errorMessages: ['', '']
      }
    }

    return (
      <StyledValidators.TextField
        key={i}
        name={formField}
        value={accountState[formField]}
        onChange={e => changeHandler('account', e)}
        {...customProps}/>
    ); 
  });
}

const createPersonalForm = (personalState, changeHandler) => {
  return Object.keys(personalState).map((formField, i) => {
    // config props and validations for <StyledValidators.TextField/> component;
    const isPhoneNumber = formField.includes('Number');
    const valRules = { validators: ['required'], errorMessages: [''] }
    const phValRules = { validators: ['required', 'isNumber'], errorMessages: ['', ''] }

    return (
      <StyledValidators.TextField
        key={i}
        name={formField}
        value={personalState[formField]}
        placeholder={convertToSentenceCase(formField)}
        onChange={e => changeHandler('personal', e)}
        {...isPhoneNumber ? 
          { type: 'tel', ...phValRules } : { type: 'text', ...valRules } 
        }/>
    );
  });
}


const getStepButtons = (styleClass, activeStep, setActiveStep, onNextValidation) => {
  return (
    <Box className={styleClass}>
      <Button
        disabled={activeStep === 0}
        onClick={() => setActiveStep(activeStep - 1)}>
        Back
      </Button>
  
    {activeStep === REGISTER_FORMS.length - 1 ? 
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