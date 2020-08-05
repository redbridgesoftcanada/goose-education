import React, { Fragment, useReducer } from 'react';
import { useHistory } from "react-router-dom";
import { Button, Container, FormLabel, Typography } from '@material-ui/core';
import { ValidatorForm } from "react-material-ui-form-validator";
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { withAuthorization } from '../components/session';
import { STATUSES, PERSONAL_FIELDS, PROGRAM_FIELDS, ARRIVAL_FIELDS, OTHER_FIELDS } from '../constants/constants';
import { convertToCamelCase, convertToTitleCase } from '../constants/helpers/_features';
import { textField, checkboxField, textValidator, selectValidator, radioValidator } from '../components/customMUI/formInputs';
import { useStyles } from '../styles/schools';

let INITIAL_STATE = {
  isLoading: false,
  isError: false,
  agreeToPrivacy: false
}

function SchoolApplicationBase(props) {
  const classes = useStyles(props, 'schoolApplication');
  const history = useHistory();
  const { authUser, firebase, listOfSchoolNames } = props;

  const formFields = [ PERSONAL_FIELDS, OTHER_FIELDS[1], PROGRAM_FIELDS, OTHER_FIELDS[0], ARRIVAL_FIELDS[0], OTHER_FIELDS[2] ].flat();
  configureFormFields(formFields);

  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  // E V E N T  L I S T E N E R S
  const handleFormInput = event => dispatch({type: event.target});

  const handleCheckboxInput = event => dispatch({ type: 'checkbox', payload: event.target });

  const onSubmit = event => {
    const { isLoading, isError, agreeToPrivacy, ...schoolApplication } = state;

    firebase.schoolApplications(authUser.uid).add({
      authorID: authUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: STATUSES[0],
      ...schoolApplication})
    .then(() => history.push('/profile'))
    // .catch(error => dispatch({type: 'error', payload: error}));
    event.preventDefault();
  }

  return (
    <Container>
      <ValidatorForm className={classes.root} onSubmit={onSubmit}>
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
                  <FormLabel component="legend" className={classes.legend}>{titleField}</FormLabel>
                  {radioValidator(field, state[field], options, handleFormInput, "")}
                </Fragment>
              )}
            
            case 'birthDate':
            case 'programStartDate':
            case 'arrivalFlightDate':
              return (
                <MuiPickersUtilsProvider utils={DateFnsUtils} key={field}>
                  <FormLabel component="legend" className={classes.legend}>{titleField}</FormLabel>
                  <KeyboardDatePicker
                  name={field}
                  value={state[field]}
                  onChange={date => dispatch({type: field, payload: date})}
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
              return (
                <Fragment key={field}>
                  <FormLabel component="legend" className={classes.legend}>{titleField}</FormLabel>
                  {radioValidator(field, state[field], options, handleFormInput, "")}
                </Fragment>
              )}
              
              case 'schoolName':
                return (
                  <Fragment key={field}>
                    <FormLabel component="legend" className={classes.legend}>{titleField}</FormLabel>
                    {selectValidator(field, state[field], listOfSchoolNames, handleFormInput)}
                  </Fragment>
                );

              case 'additionalRequests': 
                return (
                  <Fragment key={field}>
                    <Typography variant="h6">{titleField}</Typography>
                    {textField(field, state[field], handleFormInput, true)}
                  </Fragment>
                );

            default:
              return (
              <Fragment key={field}>
                <FormLabel component="legend" className={classes.legend}>{titleField}</FormLabel>    
                {textValidator(field, state[field], handleFormInput)}
              </Fragment>
              )
            }
          })
        }

        <Typography variant="h6">Privacy</Typography>
        <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
        
        {checkboxField(state.agreeToPrivacy, 'agreeToPrivacy', <Typography variant="body2">I agree to the Privacy Agreement.</Typography>, '', handleCheckboxInput)}

        <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
      </ValidatorForm>
    </Container>
)}

function configureFormFields(formFields) {
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
  // if (type === 'submit') return { ...INITIAL_STATE }
  return { ...state, [name]: value }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(SchoolApplicationBase);