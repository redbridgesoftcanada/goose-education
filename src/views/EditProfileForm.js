import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button, Container } from "@material-ui/core";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { convertToSentenceCase } from '../constants/helpers/_features';
import { withAuthorization } from '../components/session';
import StyledValidators from '../components/customMUI';
import ErrorSnackbar from '../components/ErrorSnackbar';
import useStyles from '../styles/profile';

const EditProfileForm = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { authUser, firebase, profile } = props;
  let { lastSignInTime, roles, ...profileForm } = profile;
  profileForm = Object.keys(profileForm).sort();

  const [ state, setState ] = useState({...profile});
  const [ error, setError ] = useState(null);

  const { username, email } = state;

  const onChange = e => {
    const formField = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setState({ ...state, [formField]: value });
  }

  const onSubmit = async event => {
    try {
      const updateUserDoc = firebase.user(authUser.uid).update({...state});
      const updateUserProfile = firebase.updateAccountProfile({ displayName: username, email });
  
      await Promise.all([updateUserDoc, updateUserProfile]).then(() => history.push('/profile'));
    } catch (err) {
      setError(error)
    }
    
    event.preventDefault();
  }

  return (
    <Container>
      
      {error && 
          <ErrorSnackbar 
          isOpen={!!error}
          onCloseHandler={() => setError(null)}
          errorMessage={error}/>
      }

      <ValidatorForm onSubmit={onSubmit}>
        {profileForm.map((formField, i) => 
          <StyledValidators.TextField 
            key={i}
            label={convertToSentenceCase(formField)}
            name={formField}
            value={state[formField]}
            onChange={onChange}
            validators={['required', 'isQuillEmpty']}
            errorMessages={['', '']}
          />
        )}
  
        <Button className={classes.submitButton}
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