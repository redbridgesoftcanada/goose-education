import React, { useState, createRef } from 'react';
import { Button, Container } from "@material-ui/core";
import { ValidatorForm } from 'react-material-ui-form-validator';
import Snackbar from '../components/ErrorSnackbar';
import StyledValidators  from '../components/customMUI';
import { withFirebase } from '../components/firebase';
import DeleteConfirmation from '../components/DeleteConfirmation';

function DeleteAccountForm({ firebase }) {
  const loginCredentials = createRef();

  const [ state, setState ] = useState({ 
    email: '', 
    password: '',
    deleteConfirmOpen: false
  });

  const [ notification, setNotification ] = useState(null);

  const onConfirm = () => setState(prevState => ({ ...prevState, deleteConfirmOpen: !state.deleteConfirmOpen}));
  const onChange = e => setState({...state, [e.target.name]: e.target.value});

  const onValidation = () => {
    loginCredentials.current.isFormValid(false).then(isValid => isValid && onConfirm());
  }

  const onSubmit = e => {
    firebase.deleteAccount(state.email, state.password, setNotification, onConfirm);
    e.preventDefault();
  }

  return (
    <Container>
      {notification && 
        <Snackbar 
          isOpen={!!notification}
          onCloseHandler={() => setNotification(null)}
          errorMessage={notification}/>
      }

      <ValidatorForm ref={loginCredentials} onSubmit={onSubmit}>
        <StyledValidators.TextField
          type='text'
          name='email'
          value={state.email}
          onChange={onChange}
          label='Email'
          validators={['required', 'isQuillEmpty']}
          errorMessages={['', '']}/>

        <StyledValidators.TextField
          type='password'
          name='password'
          value={state.password}
          onChange={onChange}
          label='Password'
          validators={['required', 'isQuillEmpty']}
          errorMessages={['', '']}/>
        
        <br/>
        <Button 
          fullWidth
          variant="contained" 
          color="secondary"
          onClick={() => onValidation()}>
          Delete My Account
        </Button>
      </ValidatorForm>

      <DeleteConfirmation 
        deleteType='account' 
        open={state.deleteConfirmOpen} 
        handleDelete={onSubmit} 
        onClose={() => onConfirm()}/>
    </Container>
  )
}

export default withFirebase(DeleteAccountForm);