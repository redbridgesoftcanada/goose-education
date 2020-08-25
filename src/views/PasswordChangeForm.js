import React, { useState, useEffect } from 'react';
import { withFirebase } from '../components/firebase';
import { Button, Container } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import StyledValidators from '../components/customMUI';
import useStyles from '../styles/profile';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

function PasswordChangeForm(props) {
    const classes = useStyles();
    const [ state, setState ] = useState({
        passwordOne: '',
        passwordTwo: ''
    });
    const [ error, setError ] = useState(null);

    const onChange = event => setState({...state, [event.target.name]: event.target.value});
    const onSubmit = event => {
        props.firebase.doPasswordUpdate(state.passwordOne)
        .then(() => setState({ ...INITIAL_STATE }))
        .catch(error => setState({ error }));
        event.preventDefault();
    }

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', value => {
            if (value !== state.passwordOne) {
                return false;
            }
            return true;
        });

        // (optional cleanup mechanism for effects) - remove rule when not needed;
        return () => ValidatorForm.removeValidationRule('isPasswordMatch');
    });

    return (
        <Container>
            <ValidatorForm onSubmit={onSubmit}>
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