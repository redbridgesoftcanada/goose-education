import React, { Fragment, useState, useReducer } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Button, Container, FormLabel, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { withAuthorization } from '../components/session';
import { PERSONAL_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS, OTHER_FIELDS } from '../constants/constants';
import { convertToCamelCase, convertToTitleCase } from '../constants/helpers/_features';
import * as configFormInputs from '../components/customMUI/formInputs';
import ErrorSnackbar from '../components/ErrorSnackbar';

import { textField, customDatePicker, customDateTimePicker } from '../components/customMUI/formInputs';
import { useStyles } from '../styles/studyAbroad';

let formFields = [];
let INITIAL_STATE = {
  isLoading: false,
  agreeToPrivacy: false
};

function StudyAbroadServiceApplication(props) {
  const classes = useStyles(props, 'studyAbroadApplication');
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

  const handlePickerInput = (date, field) => dispatch({type: field, payload: date})

  const onSubmit = event => {
    const { isLoading, isError, agreeToPrivacy, ...applicationForm } = state;

    if (!agreeToPrivacy) {
      setError({ exists: true, message: 'Please agree to the privacy agreement.'})
    }

    if (isError) {
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
        ErrorSnackbar(error.exists, () => setError({ exists: false, message: null }))
      }

      <ValidatorForm onSubmit={onSubmit}>
          {formFields.map(field => {
            const titleField = convertToTitleCase(field);  
            field = convertToCamelCase(field);
            
            switch(field) {
              case 'gender': {              
                const options = [
                  { value: "female", label: "Female" }, 
                  { value: "male", label: "Male" }, 
                  { value: "other", label: "Other" }
                ];
                return (
                  <Fragment key={field}>
                    {configFormInputs.customRadioGroup(field, state[field], options, handleFormInput, "Gender", "")}
                  </Fragment>
              )}

              case 'arrivalFlightDate':
              case 'departureFlightDate': {
                const customProps = (field === "departureFlightDate") ? { minDate: state.arrivalFlightDate } : {};
                return (
                  <MuiPickersUtilsProvider utils={DateFnsUtils} key={field}>
                    {configFormInputs.customDateTimePicker(field, state[field], date => handlePickerInput(date, field), titleField, customProps)}
                  </MuiPickersUtilsProvider>);
              }
              
              case 'birthDate':
              case 'homestayStartDate':
              case 'homestayEndDate':
                
                const customProps = {};
                if (field !== "birthDate") {
                  customProps.disablePast = true;
                  
                  if (field === "homestayStartDate") {
                    customProps.minDate = state.arrivalFlightDate;
                  }
                  if (field === "homestayEndDate") {
                    customProps.minDate = state.homestayStartDate;
                  }

                } else if (field === "birthDate") {
                  customProps.validators = ['required'];
                  customProps.errorMessages = ['Please select an option.'];
                }

                return (
                  <MuiPickersUtilsProvider utils={DateFnsUtils} key={field}>
                    {configFormInputs.customDatePicker(field, state[field], date => handlePickerInput(date, field), titleField, customProps)}
                  </MuiPickersUtilsProvider>);

              case 'additionalRequests': 
                return (
                  <Fragment key={field}>
                    <Typography variant="h6">Additional Requests</Typography>
                    {configFormInputs.customTextField(field, state[field], handleFormInput)}
                  </Fragment>);
              
              default: {
                const customProps = {
                  validators: ['required', 'isEmpty'],
                  errorMessages: ['', '']
                }

                return (
                  <Fragment key={field}>
                    <FormLabel component="legend" className={classes.legend}>{titleField}</FormLabel>              
                    {configFormInputs.customTextField(field, state[field], handleFormInput, customProps)}
                </Fragment>);
                }
            }
          })}

          <Typography variant="h6">Privacy</Typography>
          <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          
          {configFormInputs.customCheckboxField(state.agreeToPrivacy, 'agreeToPrivacy', 'I agree to the Privacy Agreement.', '', event => dispatch({type: 'checkbox', payload: event.target}))}

          <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
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
    return INITIAL_STATE = field.includes('Date') ? {...INITIAL_STATE, [field]: format(Date.now(), 'MM/dd/yyyy')} : {...INITIAL_STATE, [field]: ''}
  });
}

function toggleReducer(state, action) {
  const { type, payload } = action;
  const { name, value } = type;

  if (type === 'checkbox') return { ...state, [payload.name]: payload.checked }
  if (typeof type === 'string' && type.includes('Date')) return { ...state, [type]: payload }
  if (type === 'submit') return { ...INITIAL_STATE }
  return { ...state, [name]: value }
}


const condition = authUser => !!authUser;
export default withAuthorization(condition)(StudyAbroadServiceApplication);