import React, { Fragment, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button, Container, FormLabel, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ValidatorForm } from "react-material-ui-form-validator";
import { format } from 'date-fns';
import { STATUSES, PERSONAL_FIELDS, PROGRAM_FIELDS, ARRIVAL_FIELDS, OTHER_FIELDS } from '../constants/constants';
import { convertToCamelCase, convertToTitleCase } from '../constants/helpers/_features';
import { withAuthorization } from '../components/session';
import ErrorSnackbar from '../components/ErrorSnackbar';
import * as StyledValidator from '../components/customMUI/formInputs';

// import { textField, customCheckboxField, textValidator, selectValidator, radioGroupValidator } from '../components/customMUI/formInputs';
import { useStyles } from '../styles/schools';

let INITIAL_STATE = { agreeToPrivacy: false }

// configure INITIAL_STATE values for all form fields;
const formFields = [ PERSONAL_FIELDS, OTHER_FIELDS[1], PROGRAM_FIELDS, OTHER_FIELDS[0], ARRIVAL_FIELDS[0], OTHER_FIELDS[2] ].flat();
configureFormDefaults(formFields);

function SchoolApplication(props) {
  const classes = useStyles(props, 'schoolApplication');
  const history = useHistory();
  const { authUser, firebase, listOfSchoolNames } = props;

  const [ userInput, setUserInput ] = useState(INITIAL_STATE);
  const [ progress, setProgress ] = useState({ loading: false, error: false, message: null });

  console.log(userInput)

  const handleFormInput = e => {
    const field = e.currentTarget.name;
    const input = e.currentTarget.value;
    setUserInput(prevState => ({...prevState, [field]: input}));
  }

  const handleCheckboxInput = e => {
    const field = e.currentTarget.name;
    const checked = e.currentTarget.checked;
    setUserInput(prevState => ({...prevState, [field]: checked}));
  }

  const handlePickerInput = (date, field) => {
    setUserInput(prevState => ({...prevState, [field]: date}));
  }

  const onSubmit = event => {
    setProgress(prevState => ({...prevState, loading: true}));

    const { agreeToPrivacy, ...schoolApplication } = userInput;

    if (!agreeToPrivacy) {
      setProgress({loading: false, error: true, message: 'Please review and agree to the privacy agreement.'});
      return;
    }

    firebase.schoolApplications(authUser.uid).add({
      authorID: authUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: STATUSES[0],
      ...schoolApplication})
    .then(() => {
      setProgress(prevState => ({...prevState, loading: false}));
      history.push('/profile');
    })
    .catch(err => 
      setProgress({loading: false, error: true, message: err}));

    event.preventDefault();
  }

  return (
    <Container>

      {progress.error && 
        <ErrorSnackbar 
          isOpen={progress.error}
          onCloseHandler={() => setProgress({loading: false, error: false, message: null})}
          errorMessage={progress.message}/>
      }

      <ValidatorForm className={classes.root} onSubmit={onSubmit}>
        {formFields.map(field => {
          const formLabel = convertToTitleCase(field);
          field = convertToCamelCase(field);

          const inputProps = {
            key: field,
            name: field,
            value: userInput[field],
            label: formLabel,
            onChange: handleFormInput
          }

          const validationRules = {
            validators: ['required', 'isQuillEmpty'],
            errorMessages: ['required', '']
          }

          switch(field) {
            case 'gender': {              
              const options = [
                { value: "female", label: "Female" }, 
                { value: "male", label: "Male" }, 
                { value: "other", label: "Other" }
              ];
              
              return <StyledValidator.CustomRadioGroup 
                {...inputProps} 
                {...validationRules}
                options={options}/>
            }
            
            case 'birthDate':
            case 'programStartDate':
            case 'arrivalFlightDate':
              return (
                <MuiPickersUtilsProvider utils={DateFnsUtils} key={field}>
                  <FormLabel component="legend" className={classes.legend}>{formLabel}</FormLabel>
                  <KeyboardDatePicker
                  name={field}
                  value={userInput[field]}
                  onChange={date => handlePickerInput(date, field)}
                  variant="inline"
                  format="MM/dd/yyyy"
                  {...(field !== "birthDate") && { disablePast: true }}
                  />
                </MuiPickersUtilsProvider>
              );

            case 'visa': {
              const options = [
                { value: "yes", label: "Yes" }, 
                { value: "no", label: "No" }
              ];

              return <StyledValidator.CustomRadioGroup {...inputProps} options={options}/>
            }
              
            case 'schoolName':
              return <StyledValidator.CustomSelect {...inputProps} options={listOfSchoolNames}/>

            case 'additionalRequests': 
              return (
                <StyledValidator.TextField 
                  {...inputProps}
                  multiline={true}
                  rows={5}/>
              );

            default:
              return (
                <StyledValidator.TextField 
                  {...inputProps} 
                  {...validationRules}
                />
            )}
          })
        }

        <Typography variant="h6">Privacy</Typography>
        <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        
        <StyledValidator.CustomCheckbox 
          checked={userInput.agreeToPrivacy}
          name='agreeToPrivacy'
          onChange={handleCheckboxInput}
          label={<Typography variant="body2">I agree to the Privacy Agreement.</Typography>}
        />

        <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
      </ValidatorForm>
    </Container>
)}

function configureFormDefaults(formFields) {
  formFields.map(field => {
    field = convertToCamelCase(field);
    if (field.includes('Date')) {
      INITIAL_STATE = { ...INITIAL_STATE, [field]: format(Date.now(), 'MM/dd/yyyy') }
    } else {
      INITIAL_STATE = {...INITIAL_STATE, [field]: ''}
    }
    return INITIAL_STATE;
  });
}

// function toggleReducer(state, action) {
//   const { type, payload } = action;
//   const { name, value } = type;

//   if (type === 'checkbox') return { ...state, [payload.name]: payload.checked }
//   if (typeof type === 'string' && type.includes('Date')) return { ...state, [type]: payload }
//   // if (type === 'submit') return { ...INITIAL_STATE }
//   return { ...state, [name]: value }
// }

const condition = authUser => !!authUser;
export default withAuthorization(condition)(SchoolApplication);