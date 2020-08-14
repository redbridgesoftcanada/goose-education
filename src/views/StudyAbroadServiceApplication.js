import React, { Fragment, useState, useReducer } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Button, Container, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withAuthorization } from '../components/session';
import { PERSONAL_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS, OTHER_FIELDS } from '../constants/constants';
import { convertToCamelCase, convertToTitleCase } from '../constants/helpers/_features';
import StyledValidators from '../components/customMUI';
import ErrorSnackbar from '../components/ErrorSnackbar';

let formFields = [];
let INITIAL_STATE = {
  isLoading: false,
  agreeToPrivacy: false
};

function StudyAbroadServiceApplication(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const { authUser, firebase } = props;

  configureFormFields(match);

  const [ error, setError ] = useState({
    exists: false,
    message: null
  });

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  // E V E N T  L I S T E N E R S
  const handleFormInput = event => dispatch({type: event.target});

  const handlePickerInput = (date, field) => {
    const payloadConfig = { formField: field, selectedDate: date }
    dispatch({type: 'datePicker', payload: {...payloadConfig}});
  }

  const handleCheckboxInput = event => dispatch({type: 'checkbox', payload: event.target});

  const onSubmit = event => {
    const { agreeToPrivacy, ...applicationForm } = state;

    if (!agreeToPrivacy) {
      setError({ exists: true, message: 'Please agree to the privacy agreement.'})
    }

    if (error.exists) {
      return;
    }

    const firebaseRef = (match.url.includes('homestay')) ? firebase.homestayApplications(authUser.uid) : firebase.airportRideApplications(authUser.uid);
    firebaseRef.add({
      authorID: authUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...applicationForm})
    .then(() => history.push('/profile'))
    // .catch(error => dispatch({ type: 'error', payload: error }));
    event.preventDefault();
  }

  return (
    <Container>
      {error.exists && 
        ErrorSnackbar(error.exists, () => setError({ exists: false, message: null }))}

      <ValidatorForm onSubmit={onSubmit}>
        {formFields.map(field => {
          const formLabel = convertToTitleCase(field);  
          field = convertToCamelCase(field);
          
          const inputProps = {
            key: field,
            name: field,
            value: state[field],
            label: formLabel,
            onChange: !field.includes('Date') ? 
              handleFormInput : date => handlePickerInput(date, field)
          }

          const validationRules = {
            validators: ['required', 'isQuillEmpty'],
            errorMessages: ['', '']
          }

          switch(field) {
            case 'gender': {              
              const options = [
                { value: "female", label: "Female" }, 
                { value: "male", label: "Male" }, 
                { value: "other", label: "Other" }
              ];
              return (
                <StyledValidators.CustomRadioGroup
                  {...inputProps}
                  {...validationRules}
                  options={options}/>
            )}

            case 'arrivalFlightDate':
            case 'departureFlightDate': {
              inputProps.minDate = (field === "departureFlightDate") ? state.arrivalFlightDate : '';
              return (
                <MuiPickersUtilsProvider utils={DateFnsUtils} key={field}>
                  <StyledValidators.CustomDatePicker {...inputProps}/>
                </MuiPickersUtilsProvider>
              );
            }
            
            case 'birthDate':
            case 'homestayStartDate':
            case 'homestayEndDate':
              
              // const customProps = {};
              // if (field !== "birthDate") {
              //   customProps.disablePast = true;
                
              //   if (field === "homestayStartDate") {
              //     customProps.minDate = state.arrivalFlightDate;
              //   }
              //   if (field === "homestayEndDate") {
              //     customProps.minDate = state.homestayStartDate;
              //   }

              // } else if (field === "birthDate") {
              //   customProps.validators = ['required'];
              //   customProps.errorMessages = ['Please select an option.'];
              // }

              return (
                <MuiPickersUtilsProvider utils={DateFnsUtils} key={field}>
                  <StyledValidators.CustomDatePicker {...inputProps}/>
                </MuiPickersUtilsProvider>);

            case 'additionalRequests': 
              return (
                <StyledValidators.TextField
                {...inputProps}
                {...validationRules}
                multiline={true}
                rows={5}/>);
            
            default: {
              return (
                <StyledValidators.TextField
                  {...inputProps}
                  {...validationRules}/>
              );
            }
          }
        })}

        <Typography variant="h6">Privacy</Typography>
        <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        
        <StyledValidators.CustomCheckbox
          checked={state.agreeToPrivacy}
          name='agreeToPrivacy'
          onChange={handleCheckboxInput}
          label={<Typography variant="body2">I agree to the Privacy Agreement.</Typography>}
          additionalText=''/>

        <div>
          <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
        </div>

      </ValidatorForm>
    </Container>
  )
}

function configureFormFields(match) {
  if (match.url.includes('homestay')) {
    formFields = [PERSONAL_FIELDS, ARRIVAL_FIELDS, HOMESTAY_FIELDS, OTHER_FIELDS[2]].flat();
  } else if (match.url.includes('airport')) {
    formFields = [PERSONAL_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS, OTHER_FIELDS[2]].flat();
  }

  formFields.map(field => {
    field = convertToCamelCase(field);
    // return INITIAL_STATE = {...INITIAL_STATE, [field]: ''}
    return INITIAL_STATE = field.includes('Date') ? {...INITIAL_STATE, [field]: Date.now()} : {...INITIAL_STATE, [field]: ''}
  });
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  const { name, value } = type;

  if (type === 'checkbox') return { ...state, [payload.name]: payload.checked }
  if (type === 'datePicker') {
    return {...state, [payload.formField]: payload.selectedDate}
  }
  if (typeof type === 'string' && type.includes('Date')) return { ...state, [type]: payload}
  // if (type === 'submit') return { ...INITIAL_STATE }
  return { ...state, [name]: value }
}


const condition = authUser => !!authUser;
export default withAuthorization(condition)(StudyAbroadServiceApplication);