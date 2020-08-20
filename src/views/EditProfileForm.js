import React, { useState } from 'react';
import { Button, Container, FormGroup } from "@material-ui/core";
import { withAuthorization } from '../components/session';
import { ValidatorForm } from 'react-material-ui-form-validator';
import StyledValidators from '../components/customMUI';
import { convertToSentenceCase } from '../constants/helpers/_features';

const EditProfileForm = (props) => {
  const { authUser, firebase, profile } = props;
  let { lastSignInTime, roles, ...profileForm } = profile;
  profileForm = Object.keys(profileForm).sort();

  const [ state, setState ] = useState({...profile});
  const [ error, setError ] = useState({ exists: false, message: null });

  const { username, email } = state;

  const onChange = e => {
    const formField = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setState({ ...state, [formField]: value });
  }

  const onSubmit = event => {
    const profileForm = state;

    firebase.user(authUser.uid).update({...profileForm})
    .then(authUser => {
      const user = authUser.user;
      user.updateProfile({
        displayName: username,
        email
      });
    })
    .catch(error => setState(error));
    event.preventDefault();
  }

  return (
    <Container>
      <ValidatorForm onSubmit={onSubmit}>
        {profileForm.map((formField, i) => {
          const isNumberInput = formField.includes('Number');
          
          const inputType = isNumberInput ? 'tel' : formField === 'email' ? 'email' : 'text';

          const valRules = { validators: ['required'], errorMessages: [''] }
          const phValRules = { validators: ['required', 'isNumber'], errorMessages: ['', ''] }
          const validationRules = isNumberInput ? phValRules : valRules;

          const inputProps = {
            key: i,
            type: inputType,
            label: convertToSentenceCase(formField),
            name: formField,
            defaultValue: state[formField],
            value: state[formField],
            onChange: onChange,
            ...validationRules
          }

        if (formField === 'receiveEmails' || formField === 'publicAccount') {
          const emailHelperText = 'I would like to receieve email notifications.';
          const publicHelperText = 'Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.';
          return (
            <Container key={i}>
              <FormGroup>
                <StyledValidators.CustomCheckbox
                  key={i}
                  checked={state[formField]}
                  name={formField}
                  onChange={onChange}
                  label={convertToSentenceCase(formField)}
                  additionalText={formField === 'receiveEmails' ? emailHelperText : publicHelperText}
                />
              </FormGroup>
            </Container>
          )
        } else if (formField === 'receiveSMS') {
          return;
        }
        
        return <StyledValidators.TextField {...inputProps}/>
      })}
  
        <Button 
          fullWidth
          variant="contained" 
          color="secondary" 
          type="submit">
            Save Changes
        </Button>

      </ValidatorForm>
    </Container>
  )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(EditProfileForm);