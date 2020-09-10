import React, { useState, useEffect } from 'react';
import { Button, Container, Typography } from '@material-ui/core';
import { ValidatorForm } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import { STATUSES, PERSONAL_FIELDS, PROGRAM_FIELDS, ARRIVAL_FIELDS, OTHER_FIELDS } from '../constants/constants';
import { convertToCamelCase, convertToTitleCase } from '../constants/helpers/_features';
import { DatabaseContext } from '../components/database';
import { withAuthorization } from '../components/session';
import ErrorSnackbar from '../components/ErrorSnackbar';
import StyledValidators from '../components/customMUI';
import { useStyles } from '../styles/schools';

let INITIAL_STATE = { agreeToPrivacy: false }
const formFields = [ PERSONAL_FIELDS, OTHER_FIELDS[1], PROGRAM_FIELDS, OTHER_FIELDS[0], ARRIVAL_FIELDS[0], OTHER_FIELDS[2] ].flat();
configureFormDefaults(formFields);

function SchoolApplication(props) {
  const classes = useStyles(props, 'schoolApplication');
  const history = useHistory();
  const { authUser, firebase } = props;

  const [ userInput, setUserInput ] = useState(INITIAL_STATE);
  const [ error, setError ] = useState(null);

  const handleFormInput = e => {
    const field = e.target.name;
    const input = (field !== 'agreeToPrivacy') ? e.target.value : e.target.checked;
    setUserInput(prevState => ({...prevState, [field]: input}));
  }

  const handlePickerInput = (date, field) => {
    setUserInput(prevState => ({...prevState, [field]: date}));
  }

  const onSubmit = event => {
    const { agreeToPrivacy, ...schoolApplication } = userInput;

    firebase.schoolApplications().add({
      authorID: authUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: STATUSES[0],
      ...schoolApplication})
    .then(() => {
      history.push('/profile');
    })
    .catch(err => setError(err.message));

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

      <ValidatorForm className={classes.root} onSubmit={onSubmit}>
        {formFields.map(field => {
          const formLabel = convertToTitleCase(field);
          field = convertToCamelCase(field);

          const defaultProps = {
            key: field,
            name: field,
            value: userInput[field],
            label: formLabel,
            onChange: handleFormInput
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
              );
            }
            
            case 'birthDate':
            case 'programStartDate':
            case 'arrivalFlightDate':
              return (
                <StyledValidators.CustomDatePicker
                  {...defaultProps}
                  validators={['isRequiredCustom']}
                  errorMessages={['']}
                  onChange={date => handlePickerInput(date, field)}
                  {...field !== "birthDate" && { disablePast: true }}/>
              );

            case 'visa': {
              const options = [
                { value: "yes", label: "Yes" }, 
                { value: "no", label: "No" }
              ];

              return (
                <StyledValidators.CustomRadioGroup 
                  {...defaultProps} 
                  {...validationRules}
                  options={options}/>
              );
            }
              
            case 'schoolName':
              return (
                <DatabaseContext.Consumer>
                  {({ state }) => {
                    const listOfSchoolNames = state.listOfSchools.map(school => school.title);
                    return (
                      <StyledValidators.CustomSelect
                        {...defaultProps}
                        options={listOfSchoolNames}
                        validators={['isRequiredCustom']}
                        errorMessages={['']}
                      />
                    )}
                  }
                </DatabaseContext.Consumer>
              );

            case 'additionalRequests': 
              return (
                <StyledValidators.TextField 
                  {...defaultProps}
                  multiline={true}
                  rows={5}/>
              );

            default:
              return (
                <StyledValidators.TextField
                  {...defaultProps}
                  {...field !== 'insurance' && { ...validationRules }}
                  {...field === 'programDuration' && { type: 'number', label: 'Program Duration (Number of Weeks)', inputProps: { min: '0' } }}
                />
            )}
          })
        }

        <Typography variant="h6">Privacy</Typography>
        <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        
        <StyledValidators.CustomCheckbox 
          checked={userInput.agreeToPrivacy}
          name='agreeToPrivacy'
          onChange={handleFormInput}
          label={<Typography variant="body2">I agree to the Privacy Agreement.</Typography>}
          additionalText=''
          value={userInput.agreeToPrivacy}
          validators={['isRequiredCustom']}
          errorMessages={['']}
        />

        <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
      </ValidatorForm>
    </Container>
)}

function configureFormDefaults(formFields) {
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
export default withAuthorization(condition)(SchoolApplication);