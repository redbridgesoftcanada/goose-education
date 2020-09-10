import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Button, Container, Typography } from '@material-ui/core';
import { PERSONAL_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS, OTHER_FIELDS } from '../constants/constants';
import { convertToCamelCase, convertToTitleCase } from '../constants/helpers/_features';
import { withAuthorization } from '../components/session';
import StyledValidators from '../components/customMUI';
import ErrorSnackbar from '../components/ErrorSnackbar';

let formFields = [];
let INITIAL_STATE = { agreeToPrivacy: false };

function StudyAbroadServiceApplication(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const { authUser, firebase } = props;

  configureFormFields(match);

  const [ state, setState ] = useState(INITIAL_STATE);
  const [ error, setError ] = useState(null);

  const handleFormInput = e => {
    const field = e.target.name;
    const input = (field !== 'agreeToPrivacy') ? e.target.value : e.target.checked;
    setState(prevState => ({...prevState, [field]: input}));
  }

  const handlePickerInput = (date, field) => setState(prevState => ({...prevState, [field]: date}));

  const onSubmit = event => {
    const { agreeToPrivacy, ...applicationForm } = state;
    const firebaseRef = (match.url.includes('homestay')) ? firebase.homestayApplications() : firebase.airportRideApplications();
    
    firebaseRef.add({
      authorID: authUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...applicationForm
    })
    .then(() => history.push('/profile'))
    .catch(error => setError(error.message));

    event.preventDefault();
  }

  useEffect(() => {
    ValidatorForm.addValidationRule('isRequiredCustom', value => !!value);
    return () => ValidatorForm.removeValidationRule('isRequiredCustom');
  });

  return (
    <Container>
      {error && 
        <ErrorSnackbar 
          isOpen={!!error}
          onCloseHandler={() => setError(null)}
          errorMessage={error}/>}

      <ValidatorForm onSubmit={onSubmit}>
        {formFields.map(field => {
          const formLabel = convertToTitleCase(field);  
          field = convertToCamelCase(field);
          
          const defaultProps = {
            key: field,
            name: field,
            value: state[field],
            label: formLabel,
            onChange: !field.includes('Date') ? handleFormInput : date => handlePickerInput(date, field)
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
                  {...defaultProps}
                  {...validationRules}
                  options={options}/>
            )}

            case 'arrivalFlightDate':
            case 'departureFlightDate': {
              if (field === 'departureFlightDate') {
                defaultProps.minDate = state.arrivalFlightDate;
              }
              return (
                <StyledValidators.CustomDateTimePicker {...defaultProps}/>
            )}
            
            case 'birthDate':
            case 'homestayStartDate':
            case 'homestayEndDate':
              if (field !== "birthDate") {
                defaultProps.disablePast = true;
                if (field === "homestayStartDate") {
                  defaultProps.minDate = state.arrivalFlightDate;
                }
                if (field === "homestayEndDate") {
                  defaultProps.minDate = state.homestayStartDate;
                }
              }
              return (
                <StyledValidators.CustomDatePicker
                  {...defaultProps}
                  validators={['isRequiredCustom']}
                  errorMessages={['']}
                />
              );

            case 'additionalRequests': 
              return (
                <StyledValidators.TextField 
                  {...defaultProps}
                  multiline={true}
                  rows={5}/>
              );
            
            default: {
              return (
                <StyledValidators.TextField
                  {...defaultProps}
                  {...validationRules}/>
              );
            }
          }
        })}

        <br/>
        <Typography variant="h6">Privacy</Typography>
        <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        
        <StyledValidators.CustomCheckbox
          checked={state.agreeToPrivacy}
          name='agreeToPrivacy'
          onChange={handleFormInput}
          label={<Typography variant="body2">I agree to the Privacy Agreement.</Typography>}
          additionalText=''
          value={state.agreeToPrivacy}
          validators={['isRequiredCustom']}
          errorMessages={['']}/>

        <div>
          <Button fullWidth variant="contained" color="secondary" type="submit">Submit Application</Button>
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
    if (field.includes('Date')) {
      INITIAL_STATE = { ...INITIAL_STATE, [field]: null }
    } else {
      INITIAL_STATE = {...INITIAL_STATE, [field]: ''}
    }
    return INITIAL_STATE;
  });
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(StudyAbroadServiceApplication);