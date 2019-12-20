import React, { useState } from 'react';
import { withFirebase } from '../components/firebase';
import { Button, Collapse, TextField } from '@material-ui/core';

const INITIAL_STATE = {
    isOpen: false,
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

function PasswordChangeForm(props) {
    const [ state, setState ] = useState({...INITIAL_STATE});
    const { isOpen, passwordOne, passwordTwo, error } = state;

    // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    const onClick = () => setState({...state, isOpen: !isOpen})
    const onChange = event => setState({...state, [event.target.name]: event.target.value});
    const onSubmit = event => {
        props.firebase.doPasswordUpdate(passwordOne)
        .then(() => setState({ ...INITIAL_STATE }))
        .catch(error => setState({ error }));
        event.preventDefault();
    }

    return (
        <>
            <div onClick={onClick}>
                <Button>
                    Reset My Password
                </Button>
            </div>
            <Collapse in={isOpen}>
                <form onSubmit={onSubmit}>
                <TextField
                    color="secondary"
                    variant="outlined"
                    name="passwordOne"
                    value={passwordOne}
                    onChange={onChange}
                    type="password"
                    placeholder="New Password"
                />
                <TextField
                    color="secondary"
                    variant="outlined"
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={onChange}
                    type="password"
                    placeholder="Confirm New Password"
                />
                <Button 
                    variant="contained" 
                    disabled={isInvalid} 
                    type="submit"
                >
                    Reset My Password
                </Button>
                {error && <p>{error.message}</p>}
                </form>
            </Collapse>
        </>
    );

}

export default withFirebase(PasswordChangeForm);