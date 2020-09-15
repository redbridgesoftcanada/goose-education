import React, { useState, useEffect } from 'react';
import { Button, Container } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withFirebase } from '../components/firebase';
import StyledValidators from '../components/customMUI';
import Snackbar from '../components/ErrorSnackbar';
import useStyles from '../styles/profile';

function PasswordChangeForm(props) {
    const { firebase } = props;
    const [ state, setState ] = useState({
        prevPassword: '',
        passwordOne: '',
        passwordTwo: ''
    });
    const [ notification, setNotification ] = useState(null);

    const onChange = e => setState({...state, [e.target.name]: e.target.value});

    const onSubmit = e => {
        firebase.changeAccountPassword(state.prevPassword, state.passwordOne, setNotification);
        e.preventDefault();
    }

    const classes = useStyles();

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', value => {
            return value !== state.passwordOne ? false : true
        });

        // (optional cleanup mechanism for effects) - remove rule when not needed;
        return () => ValidatorForm.removeValidationRule('isPasswordMatch');
    });

    return (
        <Container>
            {notification && 
                <Snackbar 
                isOpen={!!notification}
                onCloseHandler={() => setNotification(null)}
                errorMessage={notification}/>
            }

            <ValidatorForm onSubmit={onSubmit}>
                <StyledValidators.TextField
                    type='password'
                    name='prevPassword'
                    value={state.prevPassword}
                    onChange={onChange}
                    label='Old Password'
                    validators={['required', 'isQuillEmpty']}
                    errorMessages={['', '']}/>
                
                <StyledValidators.TextField
                    type='password'
                    name='passwordOne'
                    value={state.passwordOne}
                    onChange={onChange}
                    label='New Password'
                    validators={['required', 'isQuillEmpty', 'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})']}
                    errorMessages={['', '', 'Please choose a secure password (At least one lowercase, one uppercase, one numeric character. At least 8 characters long.)']}/>

                <StyledValidators.TextField
                    type='password'
                    name='passwordTwo'
                    value={state.passwordTwo}
                    onChange={onChange}
                    label='Confirm New Password'
                    validators={['required', 'isQuillEmpty', 'isPasswordMatch']}
                    errorMessages={['', '', '']}/>

                <Button 
                    className={classes.submitButton}
                    fullWidth
                    variant="contained" 
                    color="secondary" 
                    type="submit">
                    Reset My Password
                </Button>
            </ValidatorForm>
        </Container>
    );

}

export default withFirebase(PasswordChangeForm);